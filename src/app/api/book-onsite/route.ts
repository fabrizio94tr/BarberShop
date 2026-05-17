import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { addMinutes, parseISO, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { sendBookingConfirmationEmail } from '@/lib/emails';

export async function POST(request: Request) {
  try {
    const { serviceId, locationId, barberId, appointmentDate, appointmentTime } = await request.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Recupera il servizio per sapere la durata e il prezzo
    const { data: service, error: sError } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (sError || !service) {
      return NextResponse.json({ error: 'Servizio non trovato' }, { status: 404 });
    }

    // 2. Calcola start_time ed end_time
    // appointmentDate è 'yyyy-MM-dd', appointmentTime è 'HH:mm'
    const startString = `${appointmentDate}T${appointmentTime}:00`;
    const startTime = parseISO(startString);
    const endTime = addMinutes(startTime, service.duration_minutes);

    // Gestione "Chiunque" (Anyone): se non viene selezionato un barbiere specifico,
    // ne assegniamo uno attivo per la sede selezionata.
    let actualBarberId = barberId;
    if (barberId === 'any') {
      const { data: locationBarbers, error: bError } = await supabase
        .from('barbers')
        .select('id')
        .eq('location_id', locationId)
        .eq('is_active', true)
        .limit(1);

      if (bError || !locationBarbers || locationBarbers.length === 0) {
        return NextResponse.json({ error: 'Nessun barbiere disponibile per questa sede' }, { status: 400 });
      }
      actualBarberId = locationBarbers[0].id;
    }

    // 3. Salva l'appuntamento nel database
    const { data: appointment, error: aError } = await supabase
      .from('appointments')
      .insert({
        customer_id: user.id,
        location_id: locationId,
        barber_id: actualBarberId,
        service_id: serviceId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'confirmed', // Pagamento in sede viene confermato subito (o messo in pending a seconda della policy)
        total_amount: service.price,
      })
      .select()
      .single();

    if (aError) {
      console.error('Error saving appointment:', aError);
      return NextResponse.json({ error: 'Errore nel salvataggio della prenotazione' }, { status: 500 });
    }

    // 4. Recupera i dettagli della sede per l'email
    const { data: location } = await supabase
      .from('locations')
      .select('*')
      .eq('id', locationId)
      .single();

    // 5. Invia Email di conferma
    if (user.email && location) {
      await sendBookingConfirmationEmail({
        email: user.email,
        customerName: user.user_metadata.full_name || 'Cliente',
        serviceName: service.name,
        date: format(startTime, 'd MMMM yyyy', { locale: it }),
        time: appointmentTime,
        locationName: location.name,
        address: location.address
      });
    }

    return NextResponse.json({ success: true, appointment });
  } catch (err: any) {
    console.error('API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

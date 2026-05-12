import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export async function sendBookingConfirmationEmail({
  email,
  customerName,
  serviceName,
  date,
  time,
  locationName,
  address
}: {
  email: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  locationName: string;
  address: string;
}) {
  if (!resend) {
    console.warn('Resend API Key missing. Email not sent.');
    return { success: false, error: 'Missing API Key' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Barber & Co. <onboarding@resend.dev>', // In produzione usare dominio verificato
      to: [email],
      subject: `Conferma Prenotazione: ${serviceName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 20px;">
          <h1 style="color: #000; text-transform: uppercase; letter-spacing: 2px;">Barber & Co.</h1>
          <p>Ciao <strong>${customerName}</strong>,</p>
          <p>Il tuo appuntamento è stato confermato con successo!</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
            <p><strong>Servizio:</strong> ${serviceName}</p>
            <p><strong>Data:</strong> ${date}</p>
            <p><strong>Ora:</strong> ${time}</p>
            <p><strong>Sede:</strong> ${locationName}</p>
            <p><strong>Indirizzo:</strong> ${address}</p>
          </div>
          <p style="margin-top: 20px;">Ti aspettiamo in barberia!</p>
          <p style="color: #888; font-size: 12px;">Se devi disdire o spostare l'appuntamento, ti preghiamo di farlo con almeno 24 ore di anticipo.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, error: err };
  }
}

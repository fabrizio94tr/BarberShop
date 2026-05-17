import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BookingFlow from '@/components/booking/BookingFlow'
import { MapPin } from 'lucide-react'

// Dummy data temporaneo per le location
const DUMMY_LOCATIONS: Record<string, string> = {
  '1': 'Barber & Co. - Prati',
  '2': 'Barber & Co. - Trastevere',
  '3': 'Barber & Co. - Parioli',
  '4': 'Barber & Co. - EUR',
  '5': 'Barber & Co. - Centro Storico',
  '6': 'Barber & Co. - Testaccio',
}

export default async function BookLocationPage({
  params,
}: {
  params: Promise<{ locationId: string }>
}) {
  const { locationId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Recupera il nome reale della sede dal database
  let locationName = 'Sede Sconosciuta'
  try {
    const { data: locationData } = await supabase
      .from('locations')
      .select('name')
      .eq('id', locationId)
      .single()

    if (locationData) {
      locationName = locationData.name
    } else if (DUMMY_LOCATIONS[locationId]) {
      locationName = DUMMY_LOCATIONS[locationId]
    }
  } catch (err) {
    if (DUMMY_LOCATIONS[locationId]) {
      locationName = DUMMY_LOCATIONS[locationId]
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-full mb-6">
          <MapPin className="h-4 w-4" />
          <span className="font-bold text-sm">{locationName}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Prenota il tuo appuntamento</h1>
        <p className="text-gray-500">Completa i passaggi per riservare il tuo posto.</p>
      </div>

      <BookingFlow locationId={locationId} />
    </main>
  )
}

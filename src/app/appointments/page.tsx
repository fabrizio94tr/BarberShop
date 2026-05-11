import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Calendar, Clock, MapPin, Scissors, ChevronLeft } from 'lucide-react'

// Mock Data Appuntamenti Cliente
const MOCK_APPOINTMENTS = [
  { id: '1', date: '2024-05-15', time: '10:00', location: 'Barber & Co. - Prati', service: 'Taglio Classico', price: 25, status: 'upcoming' },
  { id: '2', date: '2024-04-20', time: '16:30', location: 'Barber & Co. - Trastevere', service: 'Taglio & Barba', price: 35, status: 'completed' },
]

export default async function MyAppointmentsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Torna alla Home
        </Link>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">I miei Appuntamenti</h1>
            <p className="text-gray-500 mt-2 text-lg">Visualizza e gestisci le tue prenotazioni.</p>
          </div>
          <Link href="/">
            <Button size="sm">Nuova Prenotazione</Button>
          </Link>
        </div>

        <div className="space-y-6">
          {MOCK_APPOINTMENTS.length === 0 ? (
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Non hai ancora effettuato nessuna prenotazione.</p>
            </div>
          ) : (
            MOCK_APPOINTMENTS.map((apt) => (
              <div key={apt.id} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        apt.status === 'upcoming' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {apt.status === 'upcoming' ? 'Prossimo' : 'Completato'}
                      </span>
                      <span className="text-sm text-gray-400 font-mono">#{apt.id}</span>
                    </div>

                    <h2 className="text-2xl font-bold">{apt.service}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span>{apt.date} alle {apt.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span>{apt.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-between items-end md:items-end border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-4 md:pt-0 md:pl-8">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Prezzo</p>
                      <p className="text-2xl font-bold">€{apt.price}</p>
                    </div>
                    {apt.status === 'upcoming' && (
                      <Button variant="outline" size="sm" className="text-red-500 border-red-100 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20">
                        Annulla
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

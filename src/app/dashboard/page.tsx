import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react'

// Dati finti per simulare gli appuntamenti della giornata
const MOCK_APPOINTMENTS = [
  { id: 1, time: '09:00', duration: '30 min', service: 'Taglio Classico', customer: 'Marco Bianchi', status: 'completed' },
  { id: 2, time: '10:00', duration: '45 min', service: 'Taglio & Barba', customer: 'Luca Romano', status: 'confirmed' },
  { id: 3, time: '11:30', duration: '30 min', service: 'Regolazione Barba', customer: 'Andrea Verdi', status: 'confirmed' },
  { id: 4, time: '14:00', duration: '60 min', service: 'Trattamento VIP', customer: 'Giovanni Neri', status: 'pending' },
]

export default async function DashboardPage() {
  const supabase = await createClient()

  // In un caso reale, qui recupereremmo gli appuntamenti dal DB
  // filtrati per la sede del barbiere loggato e per la data odierna.
  
  const today = new Date()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda di Oggi</h1>
          <p className="text-gray-500 capitalize mt-1">
            {format(today, 'EEEE, d MMMM yyyy', { locale: it })}
          </p>
        </div>
        
        {/* Placeholder per controlli data (es. giorno precedente / successivo) */}
        <div className="flex items-center gap-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-1">
            <button className="px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md">Ieri</button>
            <button className="px-4 py-2 text-sm font-bold bg-black text-white dark:bg-white dark:text-black rounded-md shadow">Oggi</button>
            <button className="px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md">Domani</button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {MOCK_APPOINTMENTS.map((apt) => (
            <div key={apt.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              
              {/* Orario */}
              <div className="flex items-center sm:flex-col sm:items-start sm:w-24 shrink-0 gap-3 sm:gap-1">
                <span className="text-xl font-bold tabular-nums tracking-tight">{apt.time}</span>
                <span className="text-xs font-medium text-gray-500 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" /> {apt.duration}
                </span>
              </div>

              {/* Dettagli Servizio */}
              <div className="flex-1">
                <h3 className="text-lg font-bold">{apt.service}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
                  <User className="w-4 h-4" />
                  <span>{apt.customer}</span>
                </div>
              </div>

              {/* Stato */}
              <div className="flex shrink-0">
                {apt.status === 'completed' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Completato
                  </span>
                )}
                {apt.status === 'confirmed' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Confermato
                  </span>
                )}
                {apt.status === 'pending' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    In attesa
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { createClient } from '@/utils/supabase/server'
import { MapPin, Users, Scissors, ShieldCheck } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Impostazioni Sedi & Staff</h1>
        <p className="text-gray-500 mt-1">Gestisci le tue barberie e il personale autorizzato.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gestione Sedi */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2 bg-black text-white dark:bg-white dark:text-black rounded-lg">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">Le tue Sedi</h2>
          </div>
          
          <div className="space-y-4">
            {['Prati', 'Trastevere', 'Parioli'].map(sede => (
              <div key={sede} className="flex justify-between items-center p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <div>
                  <p className="font-bold">Barber & Co. - {sede}</p>
                  <p className="text-xs text-gray-500">Account Stripe: acct_123...</p>
                </div>
                <button className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black dark:hover:text-white">Modifica</button>
              </div>
            ))}
          </div>
          <button className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-400 font-bold hover:border-gray-400 hover:text-gray-600 transition-all">
            + Aggiungi Nuova Sede
          </button>
        </div>

        {/* Gestione Staff */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2 bg-black text-white dark:bg-white dark:text-black rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">Personale</h2>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Marco B.', role: 'Admin', location: 'Tutte' },
              { name: 'Davide R.', role: 'Barbiere', location: 'Prati' },
              { name: 'Luca V.', role: 'Barbiere', location: 'Trastevere' },
            ].map(staff => (
              <div key={staff.name} className="flex justify-between items-center p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Scissors className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold">{staff.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {staff.role} • {staff.location}
                    </p>
                  </div>
                </div>
                <button className="text-xs font-bold text-red-500 hover:underline">Rimuovi</button>
              </div>
            ))}
          </div>
          <button className="w-full py-3 bg-gray-100 dark:bg-gray-900 rounded-xl font-bold text-sm">
            Invita Collaboratore
          </button>
        </div>
      </div>
    </div>
  )
}

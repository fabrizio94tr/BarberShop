import { createClient } from '@/utils/supabase/server'
import { MapPin, Users, Plus, Edit, Trash2, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default async function SettingsPage() {
  const supabase = await createClient()

  // Recupero Sedi Reali
  const { data: locations } = await supabase
    .from('locations')
    .select('*')

  // Recupero Staff Reale
  const { data: barbers } = await supabase
    .from('barbers')
    .select('*, locations(name)')

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Impostazioni Business</h1>
          <p className="text-gray-500 mt-1">Gestisci le tue sedi, il listino servizi e il tuo staff.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Aggiungi Sede
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gestione Sedi */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-400" />
            Le tue Sedi
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {locations?.map(loc => (
              <div key={loc.id} className="p-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="font-bold text-lg">{loc.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <MapPin className="h-3 w-3" />
                    {loc.address}, {loc.city}
                  </div>
                  <div className="mt-2 text-xs font-mono text-gray-400">ID: {loc.slug}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl text-red-500"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
            {(!locations || locations.length === 0) && (
              <div className="p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-center text-gray-500">
                Non hai ancora aggiunto nessuna sede.
              </div>
            )}
          </div>
        </div>

        {/* Gestione Staff */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-400" />
              Staff
            </h2>
            <Button variant="outline" size="sm" className="h-9 px-4">Aggiungi Staff</Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {barbers?.map(barber => (
              <div key={barber.id} className="p-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center font-bold">
                    {barber.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold">{barber.name}</h3>
                    <div className="text-xs text-gray-500">Sede: {(barber.locations as any)?.name}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl text-red-500"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
            {(!barbers || barbers.length === 0) && (
              <div className="p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-center text-gray-500">
                Non ci sono ancora membri dello staff.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

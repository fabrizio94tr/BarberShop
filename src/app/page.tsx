import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { logout } from '@/app/login/actions'
import { Scissors, MapPin, ArrowRight } from 'lucide-react'

const DUMMY_LOCATIONS = [
  { id: '1', name: 'Barber & Co. - Prati', address: 'Via Cola di Rienzo, 12', price: 'da €25' },
  { id: '2', name: 'Barber & Co. - Trastevere', address: 'Piazza Trilussa, 5', price: 'da €30' },
  { id: '3', name: 'Barber & Co. - Parioli', address: 'Viale dei Parioli, 44', price: 'da €35' },
  { id: '4', name: 'Barber & Co. - EUR', address: 'Viale Europa, 110', price: 'da €25' },
  { id: '5', name: 'Barber & Co. - Centro Storico', address: 'Via del Corso, 200', price: 'da €40' },
  { id: '6', name: 'Barber & Co. - Testaccio', address: 'Via Galvani, 3', price: 'da €20' },
]

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 bg-white dark:bg-black">
      <div className="z-10 max-w-5xl w-full flex flex-col gap-12">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6" />
            <span className="font-bold tracking-tight">BARBER & CO.</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
                <form action={logout}>
                  <Button variant="ghost" size="sm">Logout</Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">Accedi</Button>
              </Link>
            )}
          </div>
        </nav>

        <div className="flex flex-col gap-8 mt-12 md:mt-20">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-2xl leading-[0.9]">
              {user ? `Ciao, ${user.user_metadata.full_name || 'Amico'}` : 'Il tuo taglio, la tua sede.'}
            </h1>
            <p className="text-xl text-gray-500 max-w-lg">
              Scegli l'eccellenza. Prenota il tuo trattamento in una delle nostre 6 barberie a Roma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {DUMMY_LOCATIONS.map((loc) => (
              <div 
                key={loc.id}
                className="group p-8 border border-gray-100 dark:border-gray-800 rounded-3xl hover:border-black dark:hover:border-white transition-all bg-gray-50/30 dark:bg-gray-900/30 flex flex-col justify-between h-64"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <MapPin className="h-6 w-6 text-gray-400" />
                    <span className="text-sm font-mono font-bold bg-black text-white dark:bg-white dark:text-black px-2 py-1 rounded">
                      {loc.price}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{loc.name}</h3>
                  <p className="text-sm text-gray-500">{loc.address}</p>
                </div>
                
                <Link href={user ? `/book/${loc.id}` : '/login'} className="mt-6">
                  <Button className="w-full justify-between" variant="outline">
                    Prenota ora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

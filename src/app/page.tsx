import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { logout } from '@/app/login/actions'
import { Scissors, MapPin, ArrowRight } from 'lucide-react'

const DUMMY_LOCATIONS = [
  { id: '1', slug: 'prati', name: 'Barber & Co. - Prati', address: 'Via Cola di Rienzo, 12', price: 'da €25', image: '/shop_1.png' },
  { id: '2', slug: 'trastevere', name: 'Barber & Co. - Trastevere', address: 'Piazza Trilussa, 5', price: 'da €30', image: '/shop_2.png' },
  { id: '3', slug: 'parioli', name: 'Barber & Co. - Parioli', address: 'Viale dei Parioli, 44', price: 'da €35', image: '/shop_3.png' },
  { id: '4', slug: 'eur', name: 'Barber & Co. - EUR', address: 'Viale Europa, 110', price: 'da €25', image: '/shop_1.png' },
  { id: '5', slug: 'centro', name: 'Barber & Co. - Centro Storico', address: 'Via del Corso, 200', price: 'da €40', image: '/shop_2.png' },
  { id: '6', slug: 'testaccio', name: 'Barber & Co. - Testaccio', address: 'Via Galvani, 3', price: 'da €20', image: '/shop_3.png' },
]

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userRole = 'customer'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile) {
      userRole = profile.role
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center p-6 sm:p-24 text-white">
      {/* Background Hero */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero_bg.png)' }}
      />
      <div className="absolute inset-0 z-0 bg-black/80 backdrop-blur-[2px]" />

      <div className="z-10 max-w-6xl w-full flex flex-col gap-12">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white text-black p-2 rounded-full">
              <Scissors className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-widest text-xl uppercase">BARBER & CO.</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/appointments" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block mr-2">
                  I miei Appuntamenti
                </Link>
                <span className="text-sm text-gray-500 hidden md:block">{user.email}</span>
                {(userRole === 'admin' || userRole === 'barber') && (
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-black transition-all">Dashboard</Button>
                  </Link>
                )}
                <form action={logout}>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all">Logout</Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-200 border-none px-6 transition-all">Accedi</Button>
              </Link>
            )}
          </div>
        </nav>

        <div className="flex flex-col gap-8 mt-12 md:mt-24">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter max-w-4xl leading-[0.9] text-white uppercase">
              {user ? `Ciao, ${user.user_metadata.full_name?.split(' ')[0] || 'Amico'}` : 'L\'eccellenza del grooming.'}
            </h1>
            <p className="text-xl text-gray-300 max-w-lg font-light leading-relaxed">
              Scegli lo stile. Prenota il tuo trattamento premium in una delle nostre barberie esclusive a Roma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {DUMMY_LOCATIONS.map((loc) => (
              <div 
                key={loc.id}
                className="group relative overflow-hidden rounded-[2rem] transition-transform duration-500 hover:-translate-y-2 h-[380px] flex flex-col justify-end ring-1 ring-white/10 hover:ring-white/30"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${loc.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                
                <div className="relative z-20 p-8 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <div className="bg-black/50 backdrop-blur-md p-2.5 rounded-full border border-white/10 text-white">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-mono font-bold bg-white text-black px-4 py-1.5 rounded-full shadow-xl">
                      {loc.price}
                    </span>
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="text-3xl font-bold mb-2 text-white tracking-tight uppercase">{loc.name}</h3>
                    <p className="text-sm text-gray-300 mb-8 font-light">{loc.address}</p>
                    
                    <Link href={`/location/${loc.slug}`}>
                      <Button className="w-full justify-between h-14 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all group-hover:bg-white group-hover:text-black rounded-xl">
                        <span className="font-semibold text-base">Scopri la sede</span>
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

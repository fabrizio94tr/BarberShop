import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { MapPin, Clock, Scissors, User, ArrowRight, ChevronLeft, Star, Phone, Camera } from 'lucide-react'

const DUMMY_LOCATIONS = [
  { id: '1', slug: 'prati', name: 'Barber & Co. - Prati', address: 'Via Cola di Rienzo, 12', image: '/shop_1.png', phone: '+39 06 123456', hours: '09:00 - 20:00' },
  { id: '2', slug: 'trastevere', name: 'Barber & Co. - Trastevere', address: 'Piazza Trilussa, 5', image: '/shop_2.png', phone: '+39 06 654321', hours: '10:00 - 21:00' },
  { id: '3', slug: 'parioli', name: 'Barber & Co. - Parioli', address: 'Viale dei Parioli, 44', image: '/shop_3.png', phone: '+39 06 112233', hours: '09:00 - 20:00' },
  { id: '4', slug: 'eur', name: 'Barber & Co. - EUR', address: 'Viale Europa, 110', image: '/shop_1.png', phone: '+39 06 445566', hours: '09:00 - 20:00' },
  { id: '5', slug: 'centro', name: 'Barber & Co. - Centro Storico', address: 'Via del Corso, 200', image: '/shop_2.png', phone: '+39 06 778899', hours: '10:00 - 21:00' },
  { id: '6', slug: 'testaccio', name: 'Barber & Co. - Testaccio', address: 'Via Galvani, 3', image: '/shop_3.png', phone: '+39 06 001122', hours: '09:00 - 20:00' },
]

const DUMMY_SERVICES = [
  { id: '1', name: 'Taglio Classico', duration: '30 min', price: '25', desc: 'Taglio a forbice o macchinetta, shampoo incluso.' },
  { id: '2', name: 'Taglio & Barba', duration: '45 min', price: '35', desc: 'Servizio completo per capelli e barba con panno caldo.' },
  { id: '3', name: 'Regolazione Barba', duration: '20 min', price: '15', desc: 'Modellatura e definizione barba.' },
  { id: '4', name: 'Trattamento VIP', duration: '60 min', price: '50', desc: 'Taglio, barba, scrub viso e massaggio relax.' },
]

const DUMMY_BARBERS = [
  { name: 'Marco', role: 'Senior Barber', img: '/barber1.png' },
  { name: 'Davide', role: 'Master Stylist', img: '/barber2.png' },
  { name: 'Luca', role: 'Barber', img: '/barber3.png' },
]

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // In produzione: fetch data from Supabase based on SLUG
  const location = DUMMY_LOCATIONS.find(l => l.slug === slug) || DUMMY_LOCATIONS[0]

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${location.image})` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-between py-12">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors group">
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            Torna alle sedi
          </Link>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white/80">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-medium ml-2">4.9 (120+ recensioni)</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white uppercase">{location.name}</h1>
            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{location.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>Oggi: {location.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Info (Services) */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Scissors className="w-8 h-8" />
                I nostri Servizi
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {DUMMY_SERVICES.map(service => (
                  <div key={service.id} className="group p-6 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all bg-gray-50/50 dark:bg-gray-900/20 flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">{service.name}</h3>
                      <p className="text-gray-500 text-sm max-w-md">{service.desc}</p>
                      <span className="text-xs text-gray-400 font-medium block pt-1">{service.duration}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold block mb-2">€{service.price}</span>
                      <Link href={user ? `/book/${location.id}` : '/login'}>
                        <Button size="sm" variant="outline" className="rounded-full group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                          Scegli
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <User className="w-8 h-8" />
                Il nostro Staff
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {DUMMY_BARBERS.map(barber => (
                  <div key={barber.name} className="space-y-4">
                    <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-900 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                      {/* Placeholder per foto staff */}
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-4xl">
                        {barber.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{barber.name}</h3>
                      <p className="text-sm text-gray-500">{barber.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (CTA & Info) */}
          <div className="space-y-8">
            <div className="sticky top-24 space-y-6">
              <div className="bg-black text-white dark:bg-white dark:text-black p-8 rounded-[2.5rem] shadow-2xl">
                <h3 className="text-2xl font-bold mb-4">Pronto al cambio look?</h3>
                <p className="text-white/70 dark:text-black/70 mb-8 font-light">Prenota ora il tuo appuntamento in pochi secondi.</p>
                <Link href={user ? `/book/${location.id}` : '/login'}>
                  <Button className="w-full h-16 rounded-2xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all font-bold text-lg flex justify-between px-8 shadow-xl shadow-black/10">
                    <span className="flex-1 text-left">Prenota Ora</span>
                    <ArrowRight className="w-6 h-6" />
                  </Button>
                </Link>
              </div>

              <div className="p-8 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] space-y-6">
                <h3 className="font-bold text-lg">Contatti & Orari</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Camera className="w-4 h-4 text-gray-400" />
                    <span className="hover:underline cursor-pointer">@barber_co_roma</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Lun - Sab</span>
                    <span>{location.hours}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Domenica</span>
                    <span className="font-bold text-red-500">Chiuso</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

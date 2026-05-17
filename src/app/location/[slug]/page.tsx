import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { MapPin, Clock, Scissors, User, ArrowRight, Star, Phone, Camera, MessageSquare } from 'lucide-react'
import ReviewList from '@/components/location/ReviewList'
import ImageGallery from '@/components/location/ImageGallery'

// Fallback data
const FALLBACK_LOCATION = { id: '1', slug: 'prati', name: 'Barber & Co. - Prati', address: 'Via Cola di Rienzo, 12', image_url: '/shop_1.png', phone: '+39 06 123456', hours: '09:00 - 20:00' }
const FALLBACK_SERVICES = [
  { id: '1', name: 'Taglio Classico', duration_minutes: 30, price: 25, description: 'Taglio a forbice o macchinetta, shampoo incluso.' },
  { id: '2', name: 'Taglio & Barba', duration_minutes: 45, price: 35, description: 'Servizio completo per capelli e barba con panno caldo.' },
]
const FALLBACK_BARBERS = [
  { id: 'b1', name: 'Marco Rossi', role: 'Senior Barber', photo_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=400&h=500&auto=format&fit=crop' },
  { id: 'b2', name: 'Davide Bianchi', role: 'Master Stylist', photo_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&h=500&auto=format&fit=crop' },
  { id: 'b3', name: 'Luca Verdi', role: 'Barber', photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=500&auto=format&fit=crop' },
]

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // 1. Recupero Sede
  const { data: locationData } = await supabase
    .from('locations')
    .select('*')
    .eq('slug', slug)
    .single()

  const location = locationData || FALLBACK_LOCATION

  // 2. Recupero Servizi
  const { data: servicesData } = await supabase
    .from('services')
    .select('*')
    .eq('location_id', location.id)

  const services = servicesData && servicesData.length > 0 ? servicesData : FALLBACK_SERVICES

  // 3. Recupero Staff
  const { data: barbersData } = await supabase
    .from('barbers')
    .select('*')
    .eq('location_id', location.id)
    .eq('is_active', true)

  const barbers = barbersData && barbersData.length > 0 ? barbersData : FALLBACK_BARBERS

  // 4. Recupero Recensioni
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*, profiles(full_name)')
    .eq('location_id', location.id)
    .order('created_at', { ascending: false })

  const reviews = reviewsData || []
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0'

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BarberShop',
            name: location.name,
            image: location.image_url,
            address: {
              '@type': 'PostalAddress',
              streetAddress: location.address,
              addressLocality: location.city || 'Roma',
              addressRegion: 'RM',
              postalCode: '00100',
              addressCountry: 'IT',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 41.9028, // Esempio
              longitude: 12.4964,
            },
            url: `https://barbershop.vercel.app/location/${slug}`,
            telephone: location.phone,
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '09:00',
                closes: '20:00',
              },
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: avgRating,
              reviewCount: reviews.length || 1,
            },
          }),
        }}
      />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${location.image_url || '/shop_1.png'})` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end py-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white/80">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-bold ml-2">{avgRating} ({reviews.length}+ recensioni)</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white uppercase">{location.name}</h1>
            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{location.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>Oggi: {location.hours || '09:00 - 20:00'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          <div className="lg:col-span-2 space-y-24">
            {/* Servizi */}
            <section>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Scissors className="w-8 h-8" />
                I nostri Servizi
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {services.map(service => (
                  <div key={service.id} className="group p-6 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all bg-gray-50/50 dark:bg-gray-900/20 flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">{service.name}</h3>
                      <p className="text-gray-500 text-sm max-w-md">{service.description}</p>
                      <span className="text-xs text-gray-400 font-medium block pt-1">{service.duration_minutes} min</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold block mb-2">€{service.price}</span>
                      <Link href={user ? `/book/${location.id}` : `/login?next=/book/${location.id}`}>
                        <Button size="sm" variant="outline" className="rounded-full group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                          Scegli
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Staff */}
            <section>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <User className="w-8 h-8" />
                Il nostro Staff
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {barbers.map(barber => (
                  <div key={barber.id || barber.name} className="space-y-4">
                    <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-900 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                      {barber.photo_url ? (
                        <img src={barber.photo_url} alt={barber.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-4xl bg-gray-200 dark:bg-gray-800">
                          {barber.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{barber.name}</h3>
                      <p className="text-sm text-gray-500">{barber.role || 'Barber'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Galleria */}
            <section>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Camera className="w-8 h-8" />
                Galleria Lavori
              </h2>
              <ImageGallery />
            </section>

            {/* Recensioni */}
            <section>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <MessageSquare className="w-8 h-8" />
                Cosa dicono i clienti
              </h2>
              <ReviewList reviews={reviews} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="sticky top-24 space-y-6">
              <div className="bg-black text-white dark:bg-white dark:text-black p-8 rounded-[2.5rem] shadow-2xl">
                <h3 className="text-2xl font-bold mb-4">Pronto al cambio look?</h3>
                <p className="text-white/70 dark:text-black/70 mb-8 font-light">Prenota ora il tuo appuntamento in pochi secondi.</p>
                <Link href={user ? `/book/${location.id}` : `/login?next=/book/${location.id}`}>
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
                    <span>{location.hours || '09:00 - 20:00'}</span>
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

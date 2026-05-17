'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Scissors, User, Calendar as CalendarIcon, Clock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { format, addDays, isSameDay } from 'date-fns'
import { it } from 'date-fns/locale'
import { createClient } from '@/utils/supabase/client'

// Tipi per i dati
type Service = {
  id: string
  name: string
  duration_minutes: number
  price: number
  description: string
}

type Barber = {
  id: string
  name: string
  role?: string
  photo_url?: string
}

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '16:00', '16:30']

export default function BookingFlow({ locationId }: { locationId: string }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'onsite'>('online')

  // Fetch dei dati reali
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      
      // 1. Fetch Servizi
      const { data: sData } = await supabase
        .from('services')
        .select('*')
        .eq('location_id', locationId)
      
      if (sData) setServices(sData)

      // 2. Fetch Barbieri
      const { data: bData } = await supabase
        .from('barbers')
        .select('*')
        .eq('location_id', locationId)
        .eq('is_active', true)
      
      if (bData) setBarbers(bData)
      
      setLoading(false)
    }

    fetchData()
  }, [locationId, supabase])

  const handleNext = () => setStep((s) => Math.min(s + 1, 4))
  const handleBack = () => setStep((s) => Math.max(s - 1, 1))

  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i))

  const canProceed = () => {
    if (step === 1) return selectedService !== null
    if (step === 2) return selectedBarber !== null
    if (step === 3) return selectedDate !== null && selectedTime !== null
    return true
  }

  const handleConfirm = async () => {
    setStep(5) // Loading state
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService,
          locationId: locationId,
          barberId: selectedBarber,
          appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
          appointmentTime: selectedTime,
        }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Errore nel pagamento: " + (err as Error).message);
      setStep(4);
    }
  }

  const handleConfirmOnSite = async () => {
    setStep(5)
    try {
      // In una versione reale, qui chiameremmo un'API /api/book-onsite
      // che salva l'appuntamento con status 'pending' o 'confirmed'
      const response = await fetch('/api/book-onsite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService,
          locationId: locationId,
          barberId: selectedBarber,
          appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
          appointmentTime: selectedTime,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Errore nel salvataggio");
      }
      router.push('/book/success')
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Errore nel salvataggio.");
      setStep(4);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mb-4" />
        <p>Caricamento servizi e staff...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Progress Bar */}
      <div className="mb-8 flex justify-between items-center relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 dark:bg-gray-800 -z-10 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-black dark:bg-white -z-10 transition-all duration-300 rounded-full" 
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 text-gray-500 dark:bg-gray-800'}`}>
            {s}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-2xl shadow-sm">
        
        {/* Step 1: Servizio */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2"><Scissors className="h-6 w-6" /> Scegli il Servizio</h2>
              <p className="text-gray-500">I nostri trattamenti per questa sede.</p>
            </div>
            <div className="space-y-3">
              {services.map((s) => (
                <button key={s.id} onClick={() => setSelectedService(s.id)} className={`w-full text-left p-4 rounded-xl border transition-all ${selectedService === s.id ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900' : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{s.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{s.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold">€{s.price}</span>
                      <span className="text-xs text-gray-500">{s.duration_minutes} min</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Barbiere */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2"><User className="h-6 w-6" /> Scegli il Barbiere</h2>
              <p className="text-gray-500">Con chi vuoi fissare l'appuntamento?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setSelectedBarber('any')} className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${selectedBarber === 'any' ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900' : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'}`}>
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center font-bold">A</div>
                <div>
                  <h3 className="font-bold">Chiunque</h3>
                  <p className="text-xs text-gray-500">Prima disponibilità</p>
                </div>
              </button>
              {barbers.length > 0 ? barbers.map((b) => (
                <button key={b.id} onClick={() => setSelectedBarber(b.id)} className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${selectedBarber === b.id ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900' : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'}`}>
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    {b.photo_url ? <img src={b.photo_url} alt={b.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{b.name[0]}</div>}
                  </div>
                  <div>
                    <h3 className="font-bold">{b.name}</h3>
                    <p className="text-xs text-gray-500">{b.role || 'Barber'}</p>
                  </div>
                </button>
              )) : (
                <>
                  <button onClick={() => setSelectedBarber('b1')} className="flex items-center gap-4 p-4 rounded-xl border text-left border-gray-200">
                    <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=100&h=100&fit=crop" className="w-12 h-12 rounded-full object-cover" />
                    <div><h3 className="font-bold text-sm">Marco Rossi</h3><p className="text-[10px] text-gray-500">Senior Barber</p></div>
                  </button>
                  <button onClick={() => setSelectedBarber('b2')} className="flex items-center gap-4 p-4 rounded-xl border text-left border-gray-200">
                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&fit=crop" className="w-12 h-12 rounded-full object-cover" />
                    <div><h3 className="font-bold text-sm">Davide Bianchi</h3><p className="text-[10px] text-gray-500">Master Stylist</p></div>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Data & Ora */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2"><CalendarIcon className="h-6 w-6" /> Data e Ora</h2>
              <p className="text-gray-500">Seleziona quando vuoi venire a trovarci.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {availableDates.map((date) => (
                <button key={date.toISOString()} onClick={() => setSelectedDate(date)} className={`flex-shrink-0 w-20 p-3 rounded-xl border flex flex-col items-center transition-all ${isSameDay(selectedDate, date) ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'}`}>
                  <span className="text-[10px] uppercase font-bold opacity-60">{format(date, 'eee', { locale: it })}</span>
                  <span className="text-lg font-bold">{format(date, 'd')}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map((t) => (
                <button key={t} onClick={() => setSelectedTime(t)} className={`p-3 rounded-xl border text-sm font-medium transition-all ${selectedTime === t ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900' : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Conferma & Pagamento */}
        {step === 4 && (
          <div className="space-y-8 text-center py-4">
            <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
            <div>
              <h2 className="text-2xl font-bold">Riepilogo Prenotazione</h2>
              <p className="text-gray-500 mt-2">Controlla i dettagli prima di confermare.</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl text-left space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Servizio</span>
                <span className="font-bold">{services.find(s => s.id === selectedService)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Data</span>
                <span className="font-bold">{format(selectedDate, 'd MMMM yyyy', { locale: it })} alle {selectedTime}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                <span className="text-xl font-bold">Totale</span>
                <span className="text-xl font-bold">€{services.find(s => s.id === selectedService)?.price}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
                <button onClick={() => setPaymentMethod('online')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${paymentMethod === 'online' ? 'bg-white dark:bg-black shadow-sm' : 'text-gray-500'}`}>Pagamento Online</button>
                <button onClick={() => setPaymentMethod('onsite')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${paymentMethod === 'onsite' ? 'bg-white dark:bg-black shadow-sm' : 'text-gray-500'}`}>Paga in Sede</button>
              </div>
              <p className="text-xs text-gray-500">{paymentMethod === 'online' ? 'Pagherai in anticipo tramite carta di credito/Stripe.' : 'La tua prenotazione è confermata, pagherai direttamente al barbiere.'}</p>
            </div>
          </div>
        )}

        {/* Step 5: Loading State */}
        {step === 5 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mb-4" />
            <p>Stiamo elaborando la tua prenotazione...</p>
          </div>
        )}

        {/* Footer Buttons */}
        {step < 5 && (
          <div className="mt-10 flex gap-4">
            {step > 1 && (
              <Button variant="outline" className="flex-1 rounded-xl h-14" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Indietro
              </Button>
            )}
            {step < 4 ? (
              <Button disabled={!canProceed()} className="flex-1 rounded-xl h-14" onClick={handleNext}>
                Continua <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button className="flex-1 rounded-xl h-14 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90" onClick={paymentMethod === 'online' ? handleConfirm : handleConfirmOnSite}>
                Conferma Prenotazione
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

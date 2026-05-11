'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Scissors, User, Calendar as CalendarIcon, Clock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { format, addDays, isSameDay } from 'date-fns'
import { it } from 'date-fns/locale'

// Mock Data
const SERVICES = [
  { id: '1', name: 'Taglio Classico', duration: 30, price: 25, description: 'Taglio a forbice o macchinetta, shampoo incluso.' },
  { id: '2', name: 'Taglio & Barba', duration: 45, price: 35, description: 'Servizio completo per capelli e barba con panno caldo.' },
  { id: '3', name: 'Regolazione Barba', duration: 20, price: 15, description: 'Modellatura e definizione barba.' },
]

const BARBERS = [
  { id: 'any', name: 'Chiunque sia libero', role: 'Prima disponibilità' },
  { id: '1', name: 'Marco', role: 'Senior Barber' },
  { id: '2', name: 'Davide', role: 'Barber' },
]

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '16:00', '16:30']

export default function BookingFlow({ locationId }: { locationId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'onsite'>('online')

  const handleNext = () => setStep((s) => Math.min(s + 1, 4))
  const handleBack = () => setStep((s) => Math.max(s - 1, 1))

  // Genera i prossimi 14 giorni per la selezione rapida
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i))

  const canProceed = () => {
    if (step === 1) return selectedService !== null
    if (step === 2) return selectedBarber !== null
    if (step === 3) return selectedDate !== null && selectedTime !== null
    return true
  }

  const handleConfirm = async () => {
    setStep(5) // Uno stato di loading
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: selectedService,
          locationId: locationId,
          barberId: selectedBarber,
          appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
          appointmentTime: selectedTime,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        alert("Errore: " + error);
        setStep(4);
        return;
      }

      // Reindirizza l'utente alla pagina di pagamento di Stripe
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Si è verificato un errore durante la creazione del pagamento.");
      setStep(4);
    }
  }

  const handleConfirmOnSite = async () => {
    setStep(5) // Caricamento
    try {
      // Qui faremo una chiamata API per salvare l'appuntamento direttamente nel DB
      // senza passare da Stripe
      console.log("Salvataggio appuntamento in sede...");
      
      // Simulazione successo
      setTimeout(() => {
        router.push('/book/success')
      }, 1000)
    } catch (err) {
      console.error(err);
      alert("Errore nel salvataggio della prenotazione.");
      setStep(4);
    }
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
          <div 
            key={s} 
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
              ${step >= s ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 text-gray-500 dark:bg-gray-800'}
            `}
          >
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
              <p className="text-gray-500">Seleziona il trattamento desiderato.</p>
            </div>
            <div className="space-y-3">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedService === s.id 
                      ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900' 
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{s.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{s.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold">€{s.price}</span>
                      <span className="text-xs text-gray-500">{s.duration} min</span>
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
              <p className="text-gray-500">Hai una preferenza o vuoi la prima disponibilità?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BARBERS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBarber(b.id)}
                  className={`p-4 rounded-xl border transition-all text-left flex flex-col items-center sm:items-start text-center sm:text-left ${
                    selectedBarber === b.id 
                      ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900' 
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 mb-3 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="font-bold">{b.name}</h3>
                  <p className="text-xs text-gray-500">{b.role}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Data e Ora */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2"><CalendarIcon className="h-6 w-6" /> Scegli Data e Ora</h2>
              <p className="text-gray-500">Seleziona quando vuoi venire.</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Data</h3>
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {availableDates.map((date) => {
                  const isSelected = isSameDay(date, selectedDate)
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                      className={`flex-shrink-0 w-16 h-20 rounded-xl border flex flex-col items-center justify-center transition-colors ${
                        isSelected 
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' 
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
                      }`}
                    >
                      <span className="text-xs uppercase">{format(date, 'eee', { locale: it })}</span>
                      <span className="text-xl font-bold">{format(date, 'd')}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2"><Clock className="h-4 w-4" /> Orario</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedTime === time
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Riepilogo */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold">Quasi fatto!</h2>
              <p className="text-gray-500">Controlla i dettagli e conferma la prenotazione.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4">
                <span className="text-gray-500">Servizio</span>
                <span className="font-bold">{SERVICES.find(s => s.id === selectedService)?.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4">
                <span className="text-gray-500">Barbiere</span>
                <span className="font-bold">{BARBERS.find(b => b.id === selectedBarber)?.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4">
                <span className="text-gray-500">Data e Ora</span>
                <span className="font-bold capitalize text-right">
                  {format(selectedDate, 'EEEE d MMMM', { locale: it })}<br/>alle {selectedTime}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg">Totale</span>
                <span className="text-2xl font-bold">€{SERVICES.find(s => s.id === selectedService)?.price}</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Metodo di Pagamento</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === 'online' ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900' : 'border-gray-200'
                  }`}
                >
                  <p className="font-bold">Online</p>
                  <p className="text-xs text-gray-500">Carta, Apple/Google Pay</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('onsite')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === 'onsite' ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900' : 'border-gray-200'
                  }`}
                >
                  <p className="font-bold">In Sede</p>
                  <p className="text-xs text-gray-500">Paga dopo il servizio</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Loading */}
        {step === 5 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 font-medium">Stiamo preparando il pagamento sicuro...</p>
          </div>
        )}

        {/* Navigation Buttons */}
        {step <= 4 && (
          <div className="mt-8 flex justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Indietro
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => router.push('/')}>
                Annulla
              </Button>
            )}
            
            {step < 4 ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Avanti <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={paymentMethod === 'online' ? handleConfirm : handleConfirmOnSite} 
                className={paymentMethod === 'online' ? "bg-green-600 hover:bg-green-700 text-white" : "bg-black text-white dark:bg-white dark:text-black"}
              >
                {paymentMethod === 'online' ? 'Conferma e Paga' : 'Conferma Prenotazione'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

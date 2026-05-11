'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { X } from 'lucide-react'
import { format } from 'date-fns'

// Usiamo gli stessi dati mock per coerenza
const SERVICES = [
  { id: '1', name: 'Taglio Classico', duration: 30, price: 25 },
  { id: '2', name: 'Taglio & Barba', duration: 45, price: 35 },
  { id: '3', name: 'Regolazione Barba', duration: 20, price: 15 },
]

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '16:00', '16:30']

interface NewAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
}

export default function NewAppointmentModal({ isOpen, onClose, selectedDate }: NewAppointmentModalProps) {
  const [customerType, setCustomerType] = useState<'walkin' | 'registered'>('walkin')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulazione salvataggio
    setTimeout(() => {
      setLoading(false)
      alert("Appuntamento creato con successo (Mock)!")
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold">Nuovo Appuntamento</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form id="new-appointment-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Scelta Tipo Cliente */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <button
                type="button"
                onClick={() => setCustomerType('walkin')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  customerType === 'walkin' ? 'bg-white dark:bg-black shadow text-black dark:text-white' : 'text-gray-500 hover:text-black dark:hover:text-white'
                }`}
              >
                Walk-in / Telefono
              </button>
              <button
                type="button"
                onClick={() => setCustomerType('registered')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  customerType === 'registered' ? 'bg-white dark:bg-black shadow text-black dark:text-white' : 'text-gray-500 hover:text-black dark:hover:text-white'
                }`}
              >
                Cliente Registrato
              </button>
            </div>

            {/* Dati Cliente */}
            {customerType === 'walkin' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome Ospite</label>
                  <Input required placeholder="Es. Marco" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefono (Opzionale)</label>
                  <Input type="tel" placeholder="333 1234567" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">Cerca Cliente</label>
                <Input required type="email" placeholder="Email o Nome del cliente registrato..." />
                <p className="text-xs text-gray-500">In una versione reale, qui ci sarebbe un menu a tendina auto-completante.</p>
              </div>
            )}

            {/* Servizio */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Servizio</label>
              <select required className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-gray-800 dark:bg-black dark:focus-visible:ring-white">
                <option value="">Seleziona un trattamento...</option>
                {SERVICES.map(s => (
                  <option key={s.id} value={s.id}>{s.name} - €{s.price} ({s.duration} min)</option>
                ))}
              </select>
            </div>

            {/* Data e Ora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data</label>
                <Input required type="date" defaultValue={format(selectedDate, 'yyyy-MM-dd')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Orario</label>
                <select required className="flex h-11 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-gray-800 dark:bg-black dark:focus-visible:ring-white">
                  <option value="">Seleziona...</option>
                  {TIME_SLOTS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Note (Es. non si è presentato, allergie, ecc.)</label>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-gray-800 dark:bg-black dark:focus-visible:ring-white"
                placeholder="Aggiungi dettagli sull'appuntamento..."
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-[#0a0a0a]">
          <Button type="button" variant="ghost" onClick={onClose}>Annulla</Button>
          <Button type="submit" form="new-appointment-form" disabled={loading}>
            {loading ? 'Salvataggio...' : 'Crea Appuntamento'}
          </Button>
        </div>

      </div>
    </div>
  )
}

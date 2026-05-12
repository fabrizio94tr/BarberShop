'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns'
import { it } from 'date-fns/locale'
import { Clock, User, ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import NewAppointmentModal from '@/components/dashboard/NewAppointmentModal'
import { createClient } from '@/utils/supabase/client'

// Tipo per gli appuntamenti
export type Appointment = {
  id: string
  time: string
  date: Date
  duration: string
  service: string
  customer: string
  phone?: string
  notes?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  isWalkIn?: boolean
}

export default function CalendarView({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const supabase = createClient()
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Real-time Subscription
  useEffect(() => {
    const channel = supabase
      .channel('realtime_appointments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('Change received!', payload)
          // In una versione reale, qui dovremmo fare un nuovo fetch per avere i dati completi (nomi servizi, ecc.)
          // O aggiornare lo stato locale se il payload contiene tutto.
          // Per ora, un semplice avviso o refresh silenzioso dei dati.
          window.location.reload() // Metodo brutale ma efficace per ora
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Calendario logic
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Appuntamenti per il giorno selezionato
  const selectedDayAppointments = appointments
    .filter(apt => isSameDay(new Date(apt.date), selectedDate))
    .sort((a, b) => a.time.localeCompare(b.time))

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const handleGoToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Colonna Calendario */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: it })}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevMonth} className="px-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleGoToToday}>
              Oggi
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextMonth} className="px-2">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
          <div className="min-w-[700px]">
            {/* Giorni della settimana */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Griglia Giorni */}
            <div className="grid grid-cols-7">
              {/* Spazi vuoti per allineare il primo giorno del mese */}
              {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-gray-100 dark:border-gray-800/50 p-2 bg-gray-50/50 dark:bg-[#0a0a0a]" />
              ))}
              
              {daysInMonth.map((day) => {
                const dayAppointments = appointments.filter(apt => isSameDay(new Date(apt.date), day))
                const isSelected = isSameDay(day, selectedDate)
                const isCurrentDay = isToday(day)

                return (
                  <div 
                    key={day.toISOString()} 
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[100px] border-b border-r border-gray-100 dark:border-gray-800/50 p-2 cursor-pointer transition-colors relative
                      ${isSelected ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-900'}
                    `}
                  >
                    <div className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1
                      ${isCurrentDay ? 'bg-black text-white dark:bg-white dark:text-black' : ''}
                    `}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map(apt => (
                        <div key={apt.id} className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border-l-2 border-black dark:border-white truncate">
                          <span className="font-bold mr-1">{apt.time}</span>
                          {apt.customer}
                        </div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-[10px] text-gray-400 pl-1">
                          + {dayAppointments.length - 3} altri
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Colonna Lista Dettaglio */}
      <div className="w-full lg:w-[400px] flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Appuntamenti</h3>
            <p className="text-sm text-gray-500">{format(selectedDate, 'EEEE d MMMM', { locale: it })}</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="rounded-full h-12 w-12 p-0">
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-2 min-h-[400px]">
          {selectedDayAppointments.length > 0 ? (
            selectedDayAppointments.map(apt => (
              <div key={apt.id} className="p-5 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-xl group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">{apt.time}</div>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{apt.duration}</div>
                    </div>
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border
                    ${apt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:border-green-800' : 
                      apt.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800' :
                      'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800'}
                  `}>
                    {apt.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-sm">
                      {apt.customer[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{apt.customer}</div>
                      <div className="text-xs text-gray-500">{apt.service}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {apt.phone && (
                      <div className="ml-11 text-xs text-gray-400">{apt.phone}</div>
                    )}
                    {apt.notes && (
                      <div className="ml-11 mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border-l-2 border-yellow-400 text-xs italic text-gray-700 dark:text-gray-300 rounded">
                        "{apt.notes}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800/50">
                  <Button variant="ghost" size="sm" className="h-8 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black dark:hover:text-white">
                    Modifica
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    Elimina
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-full mb-4">
                <CalendarIcon className="h-8 w-8 text-gray-300" />
              </div>
              <h4 className="font-bold">Nessun appuntamento</h4>
              <p className="text-sm text-gray-400 max-w-[200px] mt-1">Non ci sono prenotazioni per questo giorno.</p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline" size="sm" className="mt-6 rounded-xl">
                Aggiungi ora
              </Button>
            </div>
          )}
        </div>
      </div>

      <NewAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedDate={selectedDate}
      />
    </div>
  )
}

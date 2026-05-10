'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns'
import { it } from 'date-fns/locale'
import { Clock, User, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Tipo per gli appuntamenti (esteso per supportare walk-in)
export type Appointment = {
  id: string
  time: string
  date: Date
  duration: string
  service: string
  customer: string
  phone?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  isWalkIn?: boolean
}

export default function CalendarView({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Calendario logic
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Appuntamenti per il giorno selezionato
  const selectedDayAppointments = initialAppointments
    .filter(apt => isSameDay(apt.date, selectedDate))
    .sort((a, b) => a.time.localeCompare(b.time))

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Colonna Calendario */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: it })}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevMonth} className="px-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Oggi
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextMonth} className="px-2">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
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
            {/* Spazi vuoti per allineare il primo giorno del mese (Lunedì = 1, Domenica = 0/7) */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-gray-100 dark:border-gray-800/50 p-2 bg-gray-50/50 dark:bg-[#0a0a0a]" />
            ))}
            
            {daysInMonth.map((day, i) => {
              const dayAppointments = initialAppointments.filter(apt => isSameDay(apt.date, day))
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
                    ${isSelected && !isCurrentDay ? 'ring-2 ring-black dark:ring-white' : ''}
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Indicatori Appuntamenti */}
                  <div className="flex flex-col gap-1 mt-2">
                    {dayAppointments.slice(0, 2).map(apt => (
                      <div key={apt.id} className="text-[10px] truncate bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5">
                        <span className="font-bold">{apt.time}</span> {apt.customer.split(' ')[0]}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-[10px] text-gray-500 font-medium pl-1">
                        +{dayAppointments.length - 2} altri
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Colonna Dettagli Giorno */}
      <div className="lg:w-96 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Appuntamenti</h3>
            <p className="text-sm text-gray-500 capitalize">{format(selectedDate, 'EEEE d MMMM', { locale: it })}</p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Nuovo
          </Button>
        </div>

        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex-1 shadow-sm">
          {selectedDayAppointments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
              <CalendarIcon className="h-12 w-12 mb-4 text-gray-300 dark:text-gray-700" />
              <p>Nessun appuntamento per questa data.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDayAppointments.map(apt => (
                <div key={apt.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold tabular-nums">{apt.time}</span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {apt.duration}
                      </span>
                    </div>
                    {apt.status === 'confirmed' && <span className="w-2 h-2 rounded-full bg-green-500" title="Confermato" />}
                    {apt.status === 'pending' && <span className="w-2 h-2 rounded-full bg-yellow-500" title="In attesa" />}
                    {apt.status === 'completed' && <span className="w-2 h-2 rounded-full bg-gray-500" title="Completato" />}
                  </div>
                  
                  <h4 className="font-bold text-md mb-1">{apt.service}</h4>
                  
                  <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{apt.customer} {apt.isWalkIn && <span className="text-[10px] ml-1 bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.5 rounded uppercase">Walk-in</span>}</span>
                    </div>
                    {apt.phone && (
                      <div className="ml-6 text-xs">{apt.phone}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { createClient } from '@/utils/supabase/server'
import CalendarView, { type Appointment } from './CalendarView'

// Dati finti per simulare gli appuntamenti (sparsi su vari giorni)
const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', time: '09:00', date: new Date(), duration: '30 min', service: 'Taglio Classico', customer: 'Marco Bianchi', phone: '333 1234567', status: 'completed' },
  { id: '2', time: '10:00', date: new Date(), duration: '45 min', service: 'Taglio & Barba', customer: 'Luca Romano', phone: '328 9876543', status: 'confirmed' },
  { id: '3', time: '11:30', date: new Date(), duration: '30 min', service: 'Regolazione Barba', customer: 'Ospite (Giovanni)', phone: '340 1122334', status: 'confirmed', isWalkIn: true },
  
  // Aggiungiamo appuntamenti per domani
  { id: '4', time: '10:00', date: new Date(new Date().setDate(new Date().getDate() + 1)), duration: '60 min', service: 'Trattamento VIP', customer: 'Andrea Verdi', phone: '331 5566778', status: 'pending' },
  { id: '5', time: '16:00', date: new Date(new Date().setDate(new Date().getDate() + 1)), duration: '30 min', service: 'Taglio Bimbo', customer: 'Francesca Neri', phone: '392 9988776', status: 'confirmed' },
]

export default async function DashboardPage() {
  const supabase = await createClient()

  // In futuro, qui recupereremo gli appuntamenti reali da Supabase
  // filtrando per la location_id del barbiere loggato
  
  return (
    <div className="max-w-7xl mx-auto">
      <CalendarView initialAppointments={MOCK_APPOINTMENTS} />
    </div>
  )
}

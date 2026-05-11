import { createClient } from '@/utils/supabase/server'
import { User, Phone, Mail, Calendar } from 'lucide-react'

// Mock Data Clienti
const MOCK_CUSTOMERS = [
  { id: '1', name: 'Marco Bianchi', email: 'marco.bianchi@email.com', phone: '333 1234567', lastVisit: '2024-05-01', totalVisits: 5 },
  { id: '2', name: 'Luca Romano', email: 'luca.romano@email.com', phone: '328 9876543', lastVisit: '2024-04-15', totalVisits: 12 },
  { id: '3', name: 'Andrea Verdi', email: 'andrea.verdi@email.com', phone: '331 5566778', lastVisit: '2024-05-10', totalVisits: 2 },
]

export default async function CustomersPage() {
  const supabase = await createClient()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Clienti</h1>
        <p className="text-gray-500 mt-1">Gestisci l'elenco dei tuoi clienti e il loro storico.</p>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contatti</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ultima Visita</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Totale</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
              {MOCK_CUSTOMERS.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-bold">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {customer.lastVisit}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {customer.totalVisits}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-sm font-bold text-black dark:text-white hover:underline">Dettagli</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

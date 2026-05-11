import { createClient } from '@/utils/supabase/server'
import { TrendingUp, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, MapPin } from 'lucide-react'

// Mock Data Statistiche
const GLOBAL_STATS = {
  totalRevenue: '12,450',
  totalAppointments: '450',
  activeCustomers: '280',
  conversionRate: '12%',
}

const STATS_BY_LOCATION = [
  { name: 'Prati', revenue: '4,200', appointments: 150, growth: '+12.5%' },
  { name: 'Trastevere', revenue: '3,800', appointments: 130, growth: '+8.2%' },
  { name: 'Parioli', revenue: '4,450', appointments: 170, growth: '+15.1%' },
]

export default async function StatsPage() {
  const supabase = await createClient()

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistiche Globali</h1>
        <p className="text-gray-500 mt-1">Panoramica delle performance di tutte le tue barberie.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
            <span className="flex items-center text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +14%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500">Fatturato Totale</p>
          <h3 className="text-3xl font-bold mt-1">€{GLOBAL_STATS.totalRevenue}</h3>
        </div>

        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="flex items-center text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +5%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500">Appuntamenti</p>
          <h3 className="text-3xl font-bold mt-1">{GLOBAL_STATS.totalAppointments}</h3>
        </div>

        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <span className="flex items-center text-xs font-bold text-purple-500 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +22%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500">Nuovi Clienti</p>
          <h3 className="text-3xl font-bold mt-1">{GLOBAL_STATS.activeCustomers}</h3>
        </div>

        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="flex items-center text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
              <ArrowDownRight className="h-3 w-3 mr-1" /> -2%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500">Tasso di Ritorno</p>
          <h3 className="text-3xl font-bold mt-1">{GLOBAL_STATS.conversionRate}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grafico Performance per Sede (Simulato) */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-8">Performance per Sede</h3>
          <div className="space-y-6">
            {STATS_BY_LOCATION.map(loc => (
              <div key={loc.name} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="font-bold">{loc.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">€{loc.revenue}</span>
                </div>
                <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black dark:bg-white rounded-full" 
                    style={{ width: `${(parseInt(loc.revenue.replace(',', '')) / 5000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Servizi */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-8">Servizi più Richiesti</h3>
          <div className="space-y-4">
            {[
              { name: 'Taglio & Barba', count: '180', color: 'bg-blue-500' },
              { name: 'Taglio Classico', count: '145', color: 'bg-green-500' },
              { name: 'Regolazione Barba', count: '85', color: 'bg-orange-500' },
              { name: 'Trattamento VIP', count: '40', color: 'bg-purple-500' },
            ].map(service => (
              <div key={service.name} className="flex items-center justify-between p-4 border border-gray-50 dark:border-gray-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${service.color}`} />
                  <span className="font-medium">{service.name}</span>
                </div>
                <span className="font-bold">{service.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

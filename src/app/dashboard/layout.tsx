import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/login/actions'
import { Button } from '@/components/ui/Button'
import { Scissors, Calendar, Users, Settings, LogOut } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verifica che l'utente sia un barbiere o admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'barber' && profile.role !== 'admin')) {
    // Se è un cliente normale, lo rimandiamo alla home
    redirect('/')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <Scissors className="h-5 w-5 mr-2" />
          <span className="font-bold tracking-tight">BarberDash</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm font-medium">
            <Calendar className="h-4 w-4" />
            Agenda
          </Link>
          <Link href="/dashboard/customers" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            Clienti
          </Link>
          {profile.role === 'admin' && (
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg text-sm text-gray-600 dark:text-gray-400">
              <Settings className="h-4 w-4" />
              Sedi & Staff
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs overflow-hidden">
              <p className="font-bold truncate">{user.user_metadata.full_name || 'Staff'}</p>
              <p className="text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <form action={logout}>
            <Button variant="outline" className="w-full justify-start text-xs h-9" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Esci
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#0a0a0a]">
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black md:hidden">
            <div className="flex items-center gap-2">
                <Scissors className="h-5 w-5" />
                <span className="font-bold tracking-tight">BarberDash</span>
            </div>
            <form action={logout}>
                <Button variant="ghost" size="sm">Esci</Button>
            </form>
        </header>
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  )
}

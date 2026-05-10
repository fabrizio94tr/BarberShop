import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { logout } from '@/app/login/actions'
import { Scissors, MapPin } from 'lucide-react'

export default async function Home() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-24 bg-white dark:bg-black">
      <div className="z-10 max-w-5xl w-full flex flex-col gap-12">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6" />
            <span className="font-bold tracking-tight">BARBER & CO.</span>
          </div>
          <form action={logout}>
            <Button variant="ghost" size="sm">Logout</Button>
          </form>
        </nav>

        <div className="flex flex-col gap-8 mt-20">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Ciao, {user.user_metadata.full_name || 'Cliente'}
            </h1>
            <p className="text-xl text-gray-500">
              Scegli una delle nostre 6 sedi per iniziare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {/* Placeholder per le sedi - Queste verranno caricate dal DB nel prossimo step */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i}
                className="group p-6 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-black dark:hover:border-white transition-all cursor-pointer bg-gray-50/50 dark:bg-gray-900/50"
              >
                <MapPin className="h-8 w-8 mb-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                <h3 className="text-xl font-bold mb-1">Barberia Sede {i}</h3>
                <p className="text-sm text-gray-500">Via Roma, {i*10} - Roma</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Prenotazione Confermata!</h1>
          <p className="text-gray-500 text-lg">
            Il tuo appuntamento è stato riservato con successo. Riceverai a breve una mail di conferma.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 text-left space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-white dark:bg-black p-2 rounded-lg shadow-sm">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Quando</p>
              <p className="font-semibold text-lg">Verrà mostrato il dato reale...</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-white dark:bg-black p-2 rounded-lg shadow-sm">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Dove</p>
              <p className="font-semibold text-lg">Sede selezionata</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full h-12 rounded-xl">
              Vai ai tuoi appuntamenti
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="ghost" className="w-full h-12 rounded-xl">
              Torna alla Home
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

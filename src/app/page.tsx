import { Scissors } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 bg-white dark:bg-black">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-6">
        <Scissors className="h-16 w-16 text-black dark:text-white" />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-center">
          BARBER & CO.
        </h1>
        <p className="text-lg text-gray-500 text-center max-w-md">
          Sistema di prenotazione multi-sede in fase di costruzione.
        </p>
      </div>
    </main>
  );
}

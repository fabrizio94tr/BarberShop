'use client'

import { useState, use } from 'react'
import { login, signup } from './actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Scissors, ArrowRight } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = use(searchParams)
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-black">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-black p-3 dark:bg-white">
            <Scissors className="h-6 w-6 text-white dark:text-black" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isLogin ? 'Bentornato' : 'Crea un account'}
          </h1>
          <p className="text-sm text-gray-500">
            {isLogin 
              ? 'Inserisci le tue credenziali per accedere' 
              : 'Unisciti alla nostra community di barberie'}
          </p>
        </div>

        <form className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="full_name">
                  Nome Completo
                </label>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="Mario Rossi"
                  required={!isLogin}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="phone">
                  Numero di Telefono
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="333 1234567"
                  required={!isLogin}
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="mario@esempio.it"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
            />
          </div>

          {message && (
            <p className="text-sm font-medium text-red-500 text-center">
              {message}
            </p>
          )}

          <div className="pt-2">
            <Button 
              formAction={isLogin ? login : signup}
              className="w-full group"
            >
              {isLogin ? 'Accedi' : 'Registrati'}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors underline underline-offset-4"
          >
            {isLogin 
              ? 'Non hai un account? Registrati' 
              : 'Hai già un account? Accedi'}
          </button>
        </div>
      </div>
    </div>
  )
}

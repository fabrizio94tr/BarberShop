'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  const next = formData.get('next') as string

  if (error) {
    const errorUrl = `/login?message=Could not authenticate user${next ? `&next=${encodeURIComponent(next)}` : ''}`
    redirect(errorUrl)
  }

  revalidatePath('/', 'layout')
  redirect(next || '/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
        phone: formData.get('phone') as string,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  const next = formData.get('next') as string

  if (error) {
    const errorUrl = `/login?message=Could not authenticate user${next ? `&next=${encodeURIComponent(next)}` : ''}`
    redirect(errorUrl)
  }

  revalidatePath('/', 'layout')
  redirect(`/login?message=Check email to continue sign in process${next ? `&next=${encodeURIComponent(next)}` : ''}`)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

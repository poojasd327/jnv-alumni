"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function login(formData: { email: string; password: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) return { error: error.message }

  redirect("/")
}

export async function register(formData: {
  email: string
  password: string
  full_name: string
  mobile: string
  jnv_state: string
  jnv_school: string
  batch_start_year: number
  passing_year: number
}) {
  const supabase = await createClient()
  const headerStore = await headers()
  const origin = headerStore.get("origin") || ""

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback`,
      data: {
        full_name: formData.full_name,
        mobile: formData.mobile,
        jnv_state: formData.jnv_state,
        jnv_school: formData.jnv_school,
        batch_start_year: formData.batch_start_year,
        passing_year: formData.passing_year,
      },
    },
  })

  if (error) return { error: error.message }

  redirect("/pending-approval")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function forgotPassword(email: string) {
  const supabase = await createClient()
  const headerStore = await headers()
  const origin = headerStore.get("origin") || ""

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?next=/profile/edit`,
  })

  if (error) return { error: error.message }

  return { success: "Password reset email sent. Check your inbox." }
}

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const start = Date.now()
  const checks: Record<string, { status: "ok" | "error"; latency_ms?: number; error?: string }> = {}

  // Check Supabase database connectivity
  try {
    const dbStart = Date.now()
    const supabase = await createClient()
    const { error } = await supabase.from("profiles").select("id").limit(1)
    checks.database = error
      ? { status: "error", error: error.message, latency_ms: Date.now() - dbStart }
      : { status: "ok", latency_ms: Date.now() - dbStart }
  } catch (err) {
    checks.database = { status: "error", error: err instanceof Error ? err.message : "Unknown error" }
  }

  // Check Supabase Auth service
  try {
    const authStart = Date.now()
    const supabase = await createClient()
    await supabase.auth.getSession()
    checks.auth = { status: "ok", latency_ms: Date.now() - authStart }
  } catch (err) {
    checks.auth = { status: "error", error: err instanceof Error ? err.message : "Unknown error" }
  }

  // Environment variable checks
  const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]
  const missingVars = requiredEnvVars.filter((v) => !process.env[v])
  checks.environment = missingVars.length > 0
    ? { status: "error", error: `Missing: ${missingVars.join(", ")}` }
    : { status: "ok" }

  const allHealthy = Object.values(checks).every((c) => c.status === "ok")
  const totalLatency = Date.now() - start

  return NextResponse.json(
    {
      status: allHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      latency_ms: totalLatency,
      version: process.env.npm_package_version || "1.0.0",
      checks,
    },
    { status: allHealthy ? 200 : 503 }
  )
}

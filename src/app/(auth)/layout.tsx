import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "JNV Alumni Network",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            JNV Alumni Network
          </h1>
          <p className="text-muted-foreground text-sm">
            Connect with your Navodaya family
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}

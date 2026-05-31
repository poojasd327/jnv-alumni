import type { Metadata } from "next"
import {
  GraduationCap,
  Users,
  Briefcase,
  Calendar,
  ShoppingBag,
} from "lucide-react"

export const metadata: Metadata = {
  title: "JNV Alumni Network",
}

function FeatureItem({
  icon: Icon,
  text,
}: {
  icon: React.ElementType
  text: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/10">
        <Icon className="size-4" />
      </div>
      <span className="text-sm">{text}</span>
    </div>
  )
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Brand Hero */}
      <div className="relative flex flex-col justify-center bg-primary px-8 py-10 text-primary-foreground md:w-1/2 md:px-16 md:py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary-foreground/20">
              <GraduationCap className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">JNV Alumni Network</h1>
              <p className="text-sm opacity-80">
                Connect with your Navodaya family
              </p>
            </div>
          </div>

          <div className="hidden space-y-4 md:block">
            <FeatureItem icon={Users} text="Connect with alumni across India" />
            <FeatureItem
              icon={Briefcase}
              text="Find jobs and career opportunities"
            />
            <FeatureItem
              icon={Calendar}
              text="Discover events and reunions"
            />
            <FeatureItem
              icon={ShoppingBag}
              text="Buy and sell within the community"
            />
          </div>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="flex flex-1 items-center justify-center bg-muted/30 p-4 md:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2 md:hidden">
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
    </div>
  )
}

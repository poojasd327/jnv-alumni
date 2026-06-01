"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/auth.schema"
import { register as registerAction } from "@/lib/actions/auth.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { INDIAN_STATES, JNV_SCHOOLS } from "@/lib/constants"

export function RegisterForm() {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      mobile: "",
      jnv_state: "",
      jnv_school: "",
      batch_start_year: undefined,
      passing_year: undefined,
      password: "",
      confirm_password: "",
    },
  })

  const selectedState = watch("jnv_state")
  const schoolOptions = selectedState ? JNV_SCHOOLS[selectedState] || [] : []

  async function onSubmit(data: RegisterFormData) {
    setLoading(true)
    const { confirm_password: _cp, ...payload } = data
    void _cp
    const result = await registerAction(payload)
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Join the JNV Alumni Network community
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              placeholder="Your full name"
              {...register("full_name")}
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="10-digit mobile number"
              {...register("mobile")}
            />
            {errors.mobile && (
              <p className="text-sm text-destructive">
                {errors.mobile.message}
              </p>
            )}
          </div>

          {/* JNV State */}
          <div className="space-y-2">
            <Label htmlFor="jnv_state">JNV State</Label>
            <select
              id="jnv_state"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("jnv_state", {
                onChange: () => {
                  setValue("jnv_school", "")
                },
              })}
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.jnv_state && (
              <p className="text-sm text-destructive">
                {errors.jnv_state.message}
              </p>
            )}
          </div>

          {/* JNV School */}
          <div className="space-y-2">
            <Label htmlFor="jnv_school">JNV School</Label>
            <select
              id="jnv_school"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedState}
              {...register("jnv_school")}
            >
              <option value="">
                {selectedState ? "Select school" : "Select a state first"}
              </option>
              {schoolOptions.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>
            {errors.jnv_school && (
              <p className="text-sm text-destructive">
                {errors.jnv_school.message}
              </p>
            )}
          </div>

          {/* Batch Years */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batch_start_year">Batch Start Year</Label>
              <Input
                id="batch_start_year"
                type="number"
                placeholder="e.g. 2005"
                {...register("batch_start_year", { valueAsNumber: true })}
              />
              {errors.batch_start_year && (
                <p className="text-sm text-destructive">
                  {errors.batch_start_year.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="passing_year">Passing Year</Label>
              <Input
                id="passing_year"
                type="number"
                placeholder="e.g. 2012"
                {...register("passing_year", { valueAsNumber: true })}
              />
              {errors.passing_year && (
                <p className="text-sm text-destructive">
                  {errors.passing_year.message}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="Re-enter your password"
              {...register("confirm_password")}
            />
            {errors.confirm_password && (
              <p className="text-sm text-destructive">
                {errors.confirm_password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

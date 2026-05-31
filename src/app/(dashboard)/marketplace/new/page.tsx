import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getCategories } from "@/lib/actions/marketplace.actions"
import { ListingForm } from "@/components/marketplace/listing-form"

export const metadata = { title: "Create Listing" }

export default async function NewListingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const userId = user.id
  const categories = await getCategories()

  return (
    <div className="max-w-2xl mx-auto">
      <ListingForm categories={categories} userId={userId} />
    </div>
  )
}

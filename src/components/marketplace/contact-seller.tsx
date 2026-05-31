"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, MessageCircle } from "lucide-react"
import { getInitials } from "@/lib/utils"

interface ContactSellerProps {
  seller: {
    id: string
    full_name: string
    avatar_url: string | null
    mobile: string
    whatsapp_number: string | null
  }
}

export function ContactSeller({ seller }: ContactSellerProps) {
  const [open, setOpen] = useState(false)
  const whatsapp = seller.whatsapp_number || seller.mobile

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full" />}>
        Contact Seller
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 py-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={seller.avatar_url || undefined} />
            <AvatarFallback>{getInitials(seller.full_name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{seller.full_name}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            render={<a href={`tel:${seller.mobile}`} />}
          >
              <Phone className="h-4 w-4 mr-2" />
              Call {seller.mobile}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-green-600 hover:text-green-700"
            render={<a href={`https://wa.me/91${whatsapp.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noopener noreferrer" />}
          >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

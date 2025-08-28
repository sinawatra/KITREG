"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

interface Phase2ModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
}

export function Phase2Modal({ isOpen, onClose, feature }: Phase2ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <Clock className="h-16 w-16 text-blue-500" />
          </div>
          <DialogTitle className="text-xl text-center text-blue-700">Coming Soon!</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 text-center">
            The <span className="font-semibold">{feature}</span> feature will be available in Phase 2 of our development.
            <br /><br />
            Thank you for your patience.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button onClick={onClose} className="px-8 bg-blue-600 hover:bg-blue-700">
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  type: "success" | "error"
  title: string
  message: string
}

export function FeedbackModal({ isOpen, onClose, type, title, message }: FeedbackModalProps) {
  const isSuccess = type === "success"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            {isSuccess ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <DialogTitle className={`text-xl text-center ${isSuccess ? "text-green-700" : "text-red-700"}`}>{title}</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 text-center">{message}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button
            onClick={onClose}
            className={`px-8 ${isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

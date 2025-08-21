"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // Redirect to a page where user can set new password
      })
      if (error) throw error
      setIsSubmitted(true)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Check Your Email</CardTitle>
          <CardDescription className="text-gray-600">
            We've sent a password reset link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-[#9B0000] hover:text-[#8A0000] font-medium hover:underline"
            >
              try again
            </button>
          </p>
          <Link href="/login">
            <Button className="w-full bg-[#9B0000] hover:bg-[#8A0000] text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-[#9B0000]">Forgot Password?</CardTitle>
        <CardDescription className="text-gray-600">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#9B0000] hover:bg-[#8A0000] text-white" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-[#9B0000] font-medium hover:underline inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

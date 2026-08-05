"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

const page = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call reset-password API
    setSubmitted(true)
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-20">
      <div className="w-[90%] max-w-md bg-white rounded-2xl p-10 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <h2 className="text-3xl font-semibold text-slate-900 text-center">Forgot password</h2>
        <p className="mt-3 text-sm text-slate-600 text-center">Enter your email to receive a password reset link.</p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Email *
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <Button type="submit" className="w-full mt-4 rounded-xl bg-blue-500 hover:bg-blue-600 h-12 text-white tracking-widest">
              SEND RESET PASSWORD LINK
            </Button>
          </form>
        ) : (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-700">If that email exists in our system, we've sent a reset link to it.</p>
            <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
              Send again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default page
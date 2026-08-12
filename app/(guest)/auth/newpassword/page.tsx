"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { resetPassword } from '@/services/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(1, 'Password is required')
    ,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
})

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

type PopupType = 'success' | 'error'

const ResetPassword = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [showPopup, setShowPopup] = useState(false)
    const [popupType, setPopupType] = useState<PopupType | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [email] = useState(searchParams.get('em') || '')
    const [code, setCode] = useState(searchParams.get('code') || '')

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        mode: 'onBlur',
    })

    const closePopup = () => {
        setShowPopup(false)
        setPopupType(null)
        form.reset()
    }

    const onSubmit = async (values: ResetPasswordFormValues) => {
        console.log('reset password values', values)
        setPopupType('success')

        const res = await resetPassword({
            code,
            password: values.password,
            passwordConfirmation: values.confirmPassword,
        })

        console.log('reset password response', res)

        const success = Boolean(
            res &&
            (res?.success || res?.data || res?.user || res?.status === 200 || res?.statusCode === 200)
        )

        if (success) {
            setPopupType('success')
        } else {
            setPopupType('error')
        }


        setShowPopup(true)
    }

    return (
        <>
            <div className="flex items-center justify-center py-10">
                <div className="w-[90%] max-w-md bg-white rounded-2xl p-10 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                    <h2 className="text-3xl font-semibold text-slate-900 text-center">Reset password</h2>
                    <p className="mt-3 text-sm text-slate-600 text-center">Create a new secure password for your account.</p>
                    <p className="mt-3 text-sm text-slate-600 text-center"><span className="font-medium text-black">{email}</span></p>

                    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8 space-y-6">
                        <FieldGroup>
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password">New password *</FieldLabel>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter new password"
                                                aria-invalid={fieldState.invalid}
                                                className="focus-visible:border-blue-500 border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500 pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <FieldGroup>
                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="confirmPassword">Confirm password *</FieldLabel>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                id="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Confirm new password"
                                                aria-invalid={fieldState.invalid}
                                                className="focus-visible:border-blue-500 border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500 pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                                                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <Button
                            type="submit"
                            className="w-full mt-4 rounded-xl bg-blue-500 cursor-pointer hover:bg-blue-600 h-12 text-white tracking-widest"
                        >
                            RESET PASSWORD
                        </Button>
                    </form>
                </div>
            </div>

            <Dialog open={showPopup} onOpenChange={(open) => {
                if (!open) {
                    closePopup()
                }
            }}>
                <DialogContent
                    showCloseButton={false}
                    className="!fixed !left-1/2 !top-1/2 !w-[50vw] !h-[50vh] !max-w-none !max-h-none !translate-x-[-50%] !translate-y-[-50%] !rounded-[20px] border-0 bg-[#f5f5f5] p-0 shadow-[0_25px_60px_rgba(15,23,42,0.15)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                >
                    <DialogTitle className="sr-only">
                        {popupType === 'success' ? 'Password reset successful' : 'Password reset failed'}
                    </DialogTitle>
                    <div className="relative flex h-full w-full items-center justify-center bg-[#f5f5f5] px-6 py-10">
                        <button
                            type="button"
                            onClick={closePopup}
                            className="absolute right-8 top-8 cursor-pointer flex h-16 w-16 items-center justify-center text-5xl font-light text-slate-900"
                            aria-label="Close popup"
                        >
                            <X className="h-10 w-10" />
                        </button>

                        {popupType === 'success' ? (
                            <div className="w-full text-center">
                                <div className="mx-auto mb-10 flex h-32 w-32 items-center justify-center rounded-full bg-[#48c98a] shadow-[0_12px_30px_rgba(72,201,138,0.25)]">
                                    <Check className="h-16 w-16 stroke-[3] text-white" />
                                </div>

                                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                                    Password reset successfully
                                </h3>

                                <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:justify-center">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="h-10 w-full max-w-[260px] rounded-xl border border-blue-500 text-blue-500 text-xl font-semibold hover:bg-blue-500 hover:text-white cursor-pointer"
                                        onClick={closePopup}
                                    >
                                        CLOSE
                                    </Button>
                                    <Button
                                        type="button"
                                        className="h-10 w-full max-w-[260px] rounded-xl bg-blue-500 text-xl font-semibold text-white hover:bg-blue-600 cursor-pointer"
                                        onClick={() => router.push('/login')}
                                    >
                                        LOGIN
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full mx-auto text-center">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                                    Password reset failed - please try again
                                </h3>

                                <div className="mt-12 flex justify-center">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="h-10 w-full max-w-[260px] rounded-xl bg-blue-500 text-xl font-semibold text-white hover:bg-blue-600 cursor-pointer"
                                        onClick={closePopup}
                                    >
                                        OK
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ResetPassword
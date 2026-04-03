"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState, useTransition } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';


export const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current Password is required"),
    password: z.string().min(1, "New Password is required"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // show error under confirmPassword field
    message: "New Password and Confirm Password must match",
});;

export type Password = z.infer<typeof passwordSchema>;

const Password = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowComfirmPassword] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')
    const [error, setError] = useState(false)

    const [successMessage, setSuccessMessage] = useState('')
    const [success, setSuccess] = useState(false)

    const form = useForm<Password>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            password: "",
            confirmPassword: "",
        },
    });

    const [isPending, startTransition] = useTransition()

    const onSubmit: SubmitHandler<z.infer<typeof passwordSchema>> = async (values: any) => {

        startTransition(async () => {
            const token = localStorage.getItem("token")

            let response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/change-password", {
                method: "PUT",
                body: JSON.stringify(values),
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "content-type": "application/json"
                },
            });

            let res = await response.json();
            console.log(res);

            if (res?.data) {
                setSuccess(true);
                setSuccessMessage(res.msg)
            } else {
                setError(true);
                setErrorMessage(res.error.message)
            }
        })
    }

    return (
        <div className="w-full bg-white py-8">

            <div className="w-full mx-auto px-8">

                {/* Page Title */}
                <h1 className="text-3xl font-semibold text-gray-900 mb-10">
                    Change Password
                </h1>

                {/* Section Header */}
                <div className="flex justify-between items-start pb-5 border-b">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Password
                        </h2>

                        <p className="text-sm text-gray-600">
                            Please enter your current password to change your password.
                        </p>
                    </div>
                </div>

                <Form {...form}>
                    <form className='mt-6 space-y-8 w-full' onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}>


                        {/* Current Password */}
                        <div className="grid grid-cols-3 gap-8 items-center">

                            <label className="text-sm font-semibold text-gray-700">
                                Current password *
                            </label>

                            <div className="col-span-2">
                                <FieldGroup>
                                    <Controller
                                        name="currentPassword"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>

                                                <div className="relative w-full">
                                                    <Input
                                                        {...field}
                                                        id="password"
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        placeholder="Enter password"
                                                        className="pr-10"
                                                        aria-invalid={fieldState.invalid}
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                    >
                                                        {showCurrentPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </div>



                        </div>

                        <div className="border-b"></div>

                        {/* New Password */}
                        <div className="grid grid-cols-3 gap-8 items-center">

                            <label className="text-sm font-semibold text-gray-700">
                                New password *
                            </label>

                            <div className="col-span-2">
                                <FieldGroup>
                                    <Controller
                                        name="password"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <div className="relative w-full">
                                                    <Input
                                                        {...field}
                                                        id="password"
                                                        type={showNewPassword ? "text" : "password"}
                                                        placeholder="Enter password"
                                                        className="pr-10"
                                                        aria-invalid={fieldState.invalid}
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </div>



                        </div>

                        <div className="border-b"></div>

                        {/* Confirm Password */}
                        <div className="grid grid-cols-3 gap-8 items-center">

                            <label className="text-sm font-semibold text-gray-700">
                                Confirm new password *
                            </label>

                            <div className="col-span-2">
                                <FieldGroup>
                                    <Controller
                                        name="confirmPassword"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <div className="relative w-full">
                                                    <Input
                                                        {...field}
                                                        id="password"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Enter password"
                                                        className="pr-10"
                                                        aria-invalid={fieldState.invalid}
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => setShowComfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </div>



                        </div>

                        {/* Footer */}
                        <div className="border-t pt-6 flex justify-end">

                            <button
                                type="submit"
                                className="bg-indigo-600 cursor-pointer text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                            >
                                Change password
                            </button>

                        </div>

                    </form>
                </Form>
            </div>
            <Dialog open={success} onOpenChange={setSuccess}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Success</DialogTitle>
                        <DialogDescription>
                            {successMessage}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <Dialog open={error} onOpenChange={setError}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Error</DialogTitle>
                        <DialogDescription>
                            {errorMessage}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>

    )
}

export default Password
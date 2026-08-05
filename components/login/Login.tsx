"use client";

import { imageUrl } from '@/lib/constants';
import { getCommonData } from '@/services/common';
import Link from 'next/link';
import React, { useEffect, useState, useTransition } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import z from 'zod';
import { Form } from '../ui/form';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { login } from '@/services/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useDispatch } from 'react-redux';
import { userLoginRequest } from '@/store/actions/user-actions';
import Cookies from "js-cookie";

const loginSchema = z.object({
    identifier: z
        .string()
        .min(5, "Email is required."),
    password: z
        .string()
        .min(2, "Password is required."),
    remember_me: z.boolean().optional()
})

const LoginPageComponent = ({ heroImageSection }: { heroImageSection: any }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');
    const registerHref = callbackUrl ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/register';
    const [open, setOpen] = useState(false)
    const [error, setError] = useState("")
    const [mounted, setMounted] = useState(false)

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            identifier: "",
            password: "",
            remember_me: false
        },
    })

    const [logo, setLogo] = useState("");

    const getHeaderData = async () => {
        const response: any = await getCommonData()

        let logo = `${process.env.NEXT_PUBLIC_IMAGE_END_POINT}` + response?.data?.attributes?.headerLogo?.data?.attributes?.url;

        setLogo(logo)
    }

    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        getHeaderData();
        setMounted(true)
    }, [])

    const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (values: any) => {

        startTransition(async () => {
            let res = await login(values)

            if (res.user) {
                // Set a cookie so the server-side layout can verify authentication
                const maxAge = values.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 1 day
                document.cookie = `token=${res.jwt}; path=/; max-age=${maxAge}; SameSite=Lax`;

                localStorage.setItem('remember', values.remember);
                localStorage.setItem('token', res.jwt);
                localStorage.setItem('username', res.user.firstName);
                localStorage.setItem('lastname', res.user.lastName);
                localStorage.setItem('userId', res.user.id);
                localStorage.setItem('email', res.user.email);
                localStorage.setItem('PTIN', res.user.PTIN);

                const token = localStorage.getItem('token');

                await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/users/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }).then((res) => {
                    return res.json()
                }).then(res => {
                    if (res.jwt) {
                        localStorage.setItem("token", res.jwt)
                        Cookies.set("token", res.jwt);

                    } else {
                        localStorage.setItem("userData", JSON.stringify(res));
                        dispatch(userLoginRequest(res));
                    }
                });

                if (!localStorage.getItem("userData")) {
                    localStorage.setItem("userData", JSON.stringify(res.user));
                }

                if (values.remember === true) {
                    localStorage.setItem('rem_email', values.identifier);
                    localStorage.setItem('rem_pass', values.password);
                } else {
                    localStorage.removeItem('rem_email');
                    localStorage.removeItem('rem_pass');
                }

                const callbackUrl = searchParams.get('callbackUrl');
                const destination = callbackUrl ? decodeURIComponent(callbackUrl) : '/learner/dashboard';

                router.push(destination)
            } else {
                setOpen(true)
                setError(res.error.message)
            }
        })
    }

    if (mounted) {
        return (
            <>

                <section className="w-[90%] mx-auto py-16">
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
                        <div className="flex-col  justify-center ">
                            <div className="inline-flex justify-start items-start">
                                <Link href="/" className="pl-6 pr-5 inline-flex flex-col justify-start items-start">
                                    {
                                        logo && <img className="w-full h-full" src={logo} />
                                    }
                                </Link>
                            </div>
                            <div className="self-stretch p-9 flex-col justify-start s flex">
                                <div className="flex-col justify-start items-center gap-8 flex w-full">
                                    <div className="self-stretch h-[78px] flex-col justify-start items-start gap-3 flex">
                                        <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">{heroImageSection?.header}</div>
                                        <div className="self-stretch text-[#475467]  font-normal font-['Inter'] leading-7">{heroImageSection?.header_description}</div>
                                    </div>
                                </div>
                                <Form {...form}>
                                    <form className='space-y-4 mt-10' onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}>
                                        <FieldGroup>
                                            <Controller
                                                name="identifier"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel htmlFor="email">
                                                            Email
                                                        </FieldLabel>
                                                        <Input
                                                            {...field}
                                                            id="email"
                                                            className="focus-visible:border-blue-500 border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder="Please enter email id"
                                                            autoComplete="off"
                                                        />
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </FieldGroup>
                                        <FieldGroup>
                                            <Controller
                                                name="password"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel htmlFor="password">
                                                            Password
                                                        </FieldLabel>
                                                        <Input
                                                            {...field}
                                                            id="password"
                                                            type='password'
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder="Please enter password"
                                                            autoComplete="off"
                                                            className="focus-visible:border-blue-500 border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                                                        />
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </FieldGroup>

                                        <div className='w-full grid grid-cols-2 gap-4 py-4'>
                                            <FieldGroup>
                                                <Controller
                                                    name="remember_me"
                                                    control={form.control}
                                                    render={({ field, fieldState }) => (
                                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                            <Checkbox
                                                                className="
                                                                    w-5 h-5
                                                                    border-2 border-gray-400
                                                                    data-[state=checked]:bg-blue-600
                                                                    data-[state=checked]:border-blue-600
                                                                    data-[state=checked]:text-white
                                                                    text-white
                                                                "
                                                                id='remember_me'
                                                                checked={field.value}
                                                                onCheckedChange={(checked) => field.onChange(!!checked)}
                                                            />
                                                            <FieldLabel htmlFor='remember_me'>Remember Your Password</FieldLabel>
                                                        </Field>
                                                    )}
                                                />
                                            </FieldGroup>
                                            <div className='text-right'>
                                                <Link href="/forgot-password" className='text-blue-600'>Forgot password</Link>
                                            </div>
                                        </div>

                                        <div className='flex gap-2 mb-4'>
                                            <Button type='submit' variant="default" className='cursor-pointer w-full py-6 rounded-4xl text-xl text-white bg-[#8181cc] hover:bg-[#6d6dd9]' disabled={isPending}>
                                                {
                                                    isPending ? (<Loader className='w-4 h-4 animate-spin cursor-pointer' />) : (
                                                        <ArrowRight className='w-4 h-4' />
                                                    )
                                                }{" "} Log in
                                            </Button>
                                        </div>

                                    </form>
                                </Form>

                                <div className="self-stretch h-11 flex-col justify-center items-center gap-3 flex mb-4">
                                    <div
                                        className="self-stretch px-4 py-2.5 bg-white rounded-lg  shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-[#d0d5dd] justify-center items-center gap-3 inline-flex overflow-hidden">
                                        <div className="w-6 h-6 relative  overflow-hidden">
                                            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_2618_5578)">
                                                    <path
                                                        d="M24.2663 12.2765C24.2663 11.4608 24.2001 10.6406 24.059 9.83813H12.7402V14.4591H19.222C18.953 15.9495 18.0888 17.2679 16.8233 18.1056V21.104H20.6903C22.9611 19.014 24.2663 15.9274 24.2663 12.2765Z"
                                                        fill="#4285F4" />
                                                    <path
                                                        d="M12.7391 24.0008C15.9756 24.0008 18.705 22.9382 20.6936 21.1039L16.8266 18.1055C15.7507 18.8375 14.3618 19.252 12.7435 19.252C9.61291 19.252 6.95849 17.1399 6.00607 14.3003H2.01562V17.3912C4.05274 21.4434 8.20192 24.0008 12.7391 24.0008Z"
                                                        fill="#34A853" />
                                                    <path
                                                        d="M6.00277 14.3002C5.50011 12.8099 5.50011 11.196 6.00277 9.70569V6.61475H2.01674C0.314734 10.0055 0.314734 14.0004 2.01674 17.3912L6.00277 14.3002Z"
                                                        fill="#FBBC04" />
                                                    <path
                                                        d="M12.7391 4.74966C14.4499 4.7232 16.1034 5.36697 17.3425 6.54867L20.7685 3.12262C18.5991 1.0855 15.7198 -0.034466 12.7391 0.000808666C8.20192 0.000808666 4.05274 2.55822 2.01562 6.61481L6.00166 9.70575C6.94967 6.86173 9.6085 4.74966 12.7391 4.74966Z"
                                                        fill="#EA4335" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_2618_5578">
                                                        <rect width="24" height="24" fill="white" transform="translate(0.5)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                        <div className="text-[#344054] text-base font-semibold font-['Inter'] leading-normal">Sign in with
                                            Google</div>
                                    </div>
                                </div>

                                <div className="self-stretch justify-center items-baseline gap-1 inline-flex">
                                    <div className="text-[#475467] text-lg font-normal font-['Inter'] leading-7">New to CPE warehouse?</div>
                                        <div className="justify-center items-center gap-1.5 flex overflow-hidden">
                                        <Link href={registerHref} className="text-[#2970fe] text-lg font-semibold font-['Inter'] leading-7">Sign
                                            up</Link>
                                    </div>
                                </div>

                                <div className="text-[#475467] text-sm font-normal font-['Inter'] leading-tight mt-5">{heroImageSection?.copyright}</div>
                            </div>
                        </div >
                        <div className="">
                            <div className="relative rounded-[20px] overflow-hidden h-full"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('${imageUrl + heroImageSection?.background_image?.data?.attributes?.url}')`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "cover"
                                }}>
                                <div className="absolute bottom-0">
                                    <div className="self-stretch pt-24 bg-gradient-to-b flex-col justify-center items-center inline-flex">
                                        <div
                                            className="self-stretch h-[178px] rounded-b-[20px] p-8 bg-white/30 border-t border-white/30 backdrop-blur-xl flex-col justify-start items-start gap-8 flex">
                                            <div className="self-stretch text-white text-3xl font-semibold font-['Inter'] leading-[38px]">
                                                {heroImageSection?.title}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className='bg-white z-100'>
                            <DialogHeader>
                                <DialogTitle>Login Error</DialogTitle>
                                <DialogDescription>
                                    {error}
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </section >
            </>
        )
    }
}

export default LoginPageComponent
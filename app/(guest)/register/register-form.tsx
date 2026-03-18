"use client"
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building, Eye, EyeOff, Mail, MapPin } from 'lucide-react'
import React, { useState, useTransition } from 'react'
import countries from "i18n-iso-countries";
import ReactCountryFlag from "react-country-flag";
import z from 'zod'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirect } from 'next/navigation'
import { Form } from '@/components/ui/form'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { registerUser } from '@/services/auth'

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));


const registSchema = z.object({
    customerType: z.string().min(1, "Customer type is required"),
    firstName: z.string().min(1, "First Name is required"),
    username: z.string().min(1, "Username is required"),
    lastName: z.string().min(1, "Last Name is required"),
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
    Pcode: z.string().min(1, "Pcode is required"),
    CFPcode: z.string().min(1, "CFPcode is required"),
    companyname: z.string().min(1, "Country Name/ Firm Name is required"),
    address1: z.string().min(1, "Email is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    pinCode: z.string().min(1, "Pincode is required"),
    newsletter1: z.boolean().refine((val) => val !== undefined, {
        message: "Please select term and condition",
    }),
})

const RegisterForm = () => {
    const [show, setShow] = useState(false)

    const countryList = Object.entries(countries.getNames("en"));

    const form = useForm<z.infer<typeof registSchema>>({
        resolver: zodResolver(registSchema),
        defaultValues: {
            customerType: "myself",
            username:"",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            Pcode: "",
            CFPcode: "",
            companyname: "",
            address1: "",
            country: "",
            state: "",
            city: "",
            pinCode: "",
            newsletter1: false,
        },
    })

    const [isPending, startTransition] = useTransition()

    const onSubmit: SubmitHandler<z.infer<typeof registSchema>> = async (values: any) => {

        startTransition(async () => {
            let res = await registerUser(values)

            if(res.user) {
                redirect("/login")
            }
        })
    }

    return (
        <Form {...form}>
            <form className='space-y-4 mt-10' onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}>
                <section className="container mx-auto w-1/2">
                    <div className="h-[177px] flex-col justify-start items-center gap-6 inline-flex">
                        <div className="w-[768px] h-[165px] flex-col justify-start items-start gap-6 flex">
                            <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-6 flex">
                                <div className="w-[768px] h-[165px] py-6 rounded-xl flex-col justify-start items-start gap-8 flex overflow-hidden">
                                    <div className="self-stretch h-[108px] pt-6 flex-col justify-start items-start gap-6 flex">
                                        <div className="flex-col justify-start items-start gap-4 flex w-full">
                                            <div className="w-full flex flex-col gap-6">
                                                <FieldGroup>
                                                    <Controller
                                                        name="customerType"
                                                        control={form.control}
                                                        render={({ field, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid} className='flex w-full'>
                                                                <FieldLabel className="text-[#101828] text-2xl font-bold leading-loose">
                                                                    Registration Type
                                                                </FieldLabel>
                                                                <RadioGroup
                                                                    value={field.value}
                                                                    onValueChange={field.onChange}
                                                                    className="flex gap-6"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <RadioGroupItem
                                                                            value="self"
                                                                            id="self"
                                                                            className="border-[#d0d5dd] data-[state=checked]:bg-[#155dee] data-[state=checked]:border-[#155dee]"
                                                                        />
                                                                        <Label
                                                                            htmlFor="self"
                                                                            className="text-[#344054] text-xl font-medium cursor-pointer"
                                                                        >
                                                                            Register for Myself
                                                                        </Label>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <RadioGroupItem
                                                                            value="other"
                                                                            id="other"
                                                                            className="border-[#101828] data-[state=checked]:bg-[#155dee] data-[state=checked]:border-[#155dee]"
                                                                        />
                                                                        <Label
                                                                            htmlFor="other"
                                                                            className="text-[#344054] text-xl font-medium cursor-pointer"
                                                                        >
                                                                            Register for someone else
                                                                        </Label>
                                                                    </div>
                                                                </RadioGroup>

                                                                {fieldState.invalid && (
                                                                    <FieldError errors={[fieldState.error]} />
                                                                )}
                                                            </Field>
                                                        )}
                                                    />
                                                </FieldGroup>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="w-[768px] py-4 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-[#e4e7ec] flex-col justify-start items-start inline-flex overflow-hidden">
                        <div className="self-stretch h-[392px] px-6 py-4 flex-col justify-start items-start gap-6 flex">
                            <div className="self-stretch h-[54px] flex-col justify-start items-start gap-5 flex">
                                <div className="self-stretch justify-start items-start gap-4 inline-flex">
                                    <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start gap-1 inline-flex">
                                        <div className="self-stretch text-[#101828] text-xl font-semibold font-['Inter'] leading-[30px]">Participant
                                            Details</div>
                                        <div className="self-stretch text-[#475467] text-sm font-normal font-['Inter'] leading-tight">This will be used
                                            while issuing your CPE Certificate</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[720px] justify-start items-start gap-6 inline-flex">
                                <div className="grow shrink basis-0 flex-col justify-start items-start gap-1.5 inline-flex">
                                    <div className="self-stretch flex-col justify-start items-start gap-1.5 flex">
                                        <FieldGroup>
                                            <Controller
                                                name="firstName"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <div className="justify-start items-start gap-0.5 inline-flex">
                                                            <FieldLabel
                                                                htmlFor="firstName"
                                                                className="text-[#344054] text-lg font-medium leading-7"
                                                            >
                                                                First name
                                                            </FieldLabel>
                                                            <span className="text-[#7e56d8] text-sm font-medium leading-tight">
                                                                *
                                                            </span>
                                                        </div>

                                                        <Input
                                                            {...field}
                                                            id="firstName"
                                                            placeholder="Enter first name"
                                                            aria-invalid={fieldState.invalid}
                                                        />

                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </FieldGroup>
                                    </div>
                                </div>
                                <div className="grow shrink basis-0 flex-col justify-start items-start gap-1.5 inline-flex">
                                    <div className="self-stretch flex-col justify-start items-start gap-1.5 flex">
                                        <FieldGroup>
                                            <Controller
                                                name="lastName"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <div className="justify-start items-start gap-0.5 inline-flex">
                                                            <FieldLabel
                                                                htmlFor="lastName"
                                                                className="text-[#344054] text-lg font-medium leading-7"
                                                            >
                                                                Last name
                                                            </FieldLabel>
                                                            <span className="text-[#7e56d8] text-sm font-medium leading-tight">
                                                                *
                                                            </span>
                                                        </div>

                                                        <Input
                                                            {...field}
                                                            id="lastName"
                                                            placeholder="Enter last name"
                                                            aria-invalid={fieldState.invalid}
                                                        />

                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </FieldGroup>
                                    </div>
                                </div>
                                <div className="grow shrink basis-0 flex-col justify-start items-start gap-1.5 inline-flex">
                                    <div className="self-stretch flex-col justify-start items-start gap-1.5 flex">
                                        <FieldGroup>
                                            <Controller
                                                name="username"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <div className="justify-start items-start gap-0.5 inline-flex">
                                                            <FieldLabel
                                                                htmlFor="username"
                                                                className="text-[#344054] text-lg font-medium leading-7"
                                                            >
                                                                Username
                                                            </FieldLabel>
                                                            <span className="text-[#7e56d8] text-sm font-medium leading-tight">
                                                                *
                                                            </span>
                                                        </div>

                                                        <Input
                                                            {...field}
                                                            id="lastname"
                                                            placeholder="Enter last name"
                                                            aria-invalid={fieldState.invalid}
                                                        />

                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </FieldGroup>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch flex-col justify-start items-start gap-1.5 flex">

                                <FieldGroup>
                                    <Controller
                                        name="email"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>


                                                <div className="justify-start items-start gap-0.5 inline-flex">
                                                    <FieldLabel
                                                        htmlFor="email"
                                                        className="text-[#344054] text-lg font-medium leading-7"
                                                    >
                                                        Email address
                                                    </FieldLabel>
                                                    <span className="text-[#7e56d8] text-sm font-medium leading-tight">
                                                        *
                                                    </span>
                                                </div>

                                                <div className="relative w-full">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                                    <Input
                                                        {...field}
                                                        id="email"
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        className="pl-10"
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                </div>

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </div>
                            <div className="w-[744px] h-[181px] flex-col justify-start items-start gap-6 flex">
                                <div className="flex-col justify-start items-start gap-1.5 flex">
                                    <div className="w-[720px] inline-flex flex-col justify-start items-start gap-1.5">
                                        <FieldGroup>
                                            <Controller
                                                name="password"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <div className="inline-flex justify-start items-start gap-0.5">
                                                            <FieldLabel
                                                                htmlFor="password"
                                                                className="text-[#344054] text-lg font-medium leading-7"
                                                            >
                                                                Password
                                                            </FieldLabel>
                                                            <span className="text-[#7e56d8] text-sm font-medium leading-tight">
                                                                *
                                                            </span>
                                                        </div>

                                                        <div className="relative w-full">
                                                            <Input
                                                                {...field}
                                                                id="password"
                                                                type={show ? "text" : "password"}
                                                                placeholder="Enter password"
                                                                className="pr-10"
                                                                aria-invalid={fieldState.invalid}
                                                            />

                                                            <button
                                                                type="button"
                                                                onClick={() => setShow(!show)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                            >
                                                                {show ? (
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
                                <div className="self-stretch h-[955px]"></div>
                                <div
                                    className="self-stretch px-4 py-2.5 bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 inline-flex overflow-hidden">
                                    <div className="px-0.5 justify-center items-center flex">
                                        <div className="text-white text-base font-semibold font-['Inter'] leading-normal">Get started</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="w-[768px] my-8 py-4 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-[#e4e7ec] flex-col justify-start items-start inline-flex overflow-hidden">

                        <div className="w-full p-6 bg-white flex-col justify-start items-start gap-6 inline-flex">
                            <div className="flex-col justify-start items-start gap-5 flex">
                                <div className="self-stretch justify-start items-start gap-4 inline-flex">
                                    <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start gap-1 inline-flex">
                                        <div className="self-stretch text-[#101828] text-xl font-semibold font-['Inter'] leading-[30px]">Additional
                                            Details</div>
                                        <div className="self-stretch text-[#475467] text-sm font-normal font-['Inter'] leading-tight"> Please provide
                                            the following information to complete your registration.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch justify-start items-start gap-6 inline-flex">
                                <div className="grow shrink basis-0 flex-col justify-start items-start gap-1.5 inline-flex">
                                    <div className="self-stretch flex-col justify-start items-start gap-1.5 flex">
                                        <FieldGroup>
                                            <Controller
                                                name="Pcode"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <div className="justify-start items-start gap-0.5 inline-flex">
                                                            <FieldLabel
                                                                htmlFor="Pcode"
                                                                className="text-[#344053] text-sm font-medium leading-tight"
                                                            >
                                                                PTIN# (for Enrolled Agents only)
                                                            </FieldLabel>
                                                        </div>

                                                        <Input
                                                            {...field}
                                                            id="ptin"
                                                            placeholder="Enter PTIN (if applicable)"
                                                            aria-invalid={fieldState.invalid}
                                                        />

                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </FieldGroup>
                                    </div>
                                </div>
                                <div className="grow shrink basis-0 flex-col justify-start items-start gap-1.5 inline-flex">
                                    <div className="self-stretch flex-col justify-start items-start gap-1.5 flex">
                                        <FieldGroup>
                                            <Controller
                                                name="CFPcode"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <div className="justify-start items-start gap-0.5 inline-flex">
                                                            <FieldLabel
                                                                htmlFor="CFPcode"
                                                                className="text-[#344053] text-sm font-medium leading-tight"
                                                            >
                                                                CFP ID# (for CFP designation holders only)
                                                            </FieldLabel>
                                                        </div>

                                                        <Input
                                                            {...field}
                                                            id="CFPcode"
                                                            placeholder="Enter CFP ID (if applicable)"
                                                            aria-invalid={fieldState.invalid}
                                                        />

                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </FieldGroup>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch flex-col justify-start items-start gap-1.5 flex">
                                <FieldGroup>
                                    <Controller
                                        name="companyname"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="companyname" className="text-[#344053] text-sm font-medium leading-tight">
                                                    Company Name/ Firm Name
                                                </FieldLabel>

                                                <div className="relative w-full">
                                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                                    <Input
                                                        {...field}
                                                        id="companyname"
                                                        placeholder="Enter company name"
                                                        className="pl-10"
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                </div>

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </div>
                            <div className="self-stretch flex-col justify-start items-start gap-1.5 flex">
                                <FieldGroup>
                                    <Controller
                                        name="address1"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <div className="justify-start items-start gap-0.5 inline-flex">
                                                    <FieldLabel
                                                        htmlFor="address1"
                                                        className="text-[#344053] text-sm font-medium leading-tight"
                                                    >
                                                        Billing Address
                                                    </FieldLabel>
                                                    <span className="text-[#7e56d8] text-sm font-medium leading-tight">
                                                        *
                                                    </span>
                                                </div>

                                                <div className="relative w-full">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                                                        <svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 20 20"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M3.33398 6.5C3.33398 5.09987 3.33398 4.3998 3.60647 3.86502C3.84615 3.39462 4.2286 3.01217 4.69901 2.77248C5.23379 2.5 5.93385 2.5 7.33398 2.5H12.6673C14.0674 2.5 14.7675 2.5 15.3023 2.77248C15.7727 3.01217 16.1552 3.39462 16.3948 3.86502C16.6673 4.3998 16.6673 5.09987 16.6673 6.5V17.5L14.3757 15.8333L12.2923 17.5L10.0007 15.8333L7.70898 17.5L5.62565 15.8333L3.33398 17.5V6.5Z"
                                                                stroke="#667085"
                                                                strokeWidth="1.66667"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </span>

                                                    <Input
                                                        {...field}
                                                        id="billingAddress"
                                                        placeholder="Enter billing address"
                                                        className="pl-10"
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                </div>

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </div>
                            <div className="self-stretch inline-flex justify-start items-start gap-8 flex-wrap content-start">
                                <FieldGroup>
                                    <Controller
                                        name="country"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid} className='flex'>
                                                <div className="inline-flex justify-start items-center gap-0.5">
                                                    <FieldLabel
                                                        htmlFor="country"
                                                        className="text-slate-700 text-sm font-semibold leading-tight"
                                                    >
                                                        Country
                                                    </FieldLabel>
                                                </div>

                                                <div className="relative w-full">
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger className="w-full" id="country">
                                                            <SelectValue placeholder="Select Country" />
                                                        </SelectTrigger>

                                                        <SelectContent>
                                                            {countryList.map(([code, name]) => (
                                                                <SelectItem key={code} value={code}>
                                                                    <div className="flex items-center gap-2">
                                                                        <ReactCountryFlag
                                                                            countryCode={code}
                                                                            svg
                                                                            style={{ width: "20px", height: "14px" }}
                                                                        />
                                                                        {name}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </div>
                            <div className="self-stretch justify-start items-start gap-6 inline-flex">
                                <div className="grow shrink basis-0 flex-col justify-start items-start gap-1.5 inline-flex">
                                    <div className="self-stretch h-[70px] flex-col justify-start items-start gap-1.5 flex">
                                        <FieldGroup>
                                            <Controller
                                                name="city"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <div className="justify-start items-start gap-0.5 inline-flex">
                                                            <FieldLabel
                                                                htmlFor="city"
                                                                className="text-[#344053] text-sm font-medium leading-tight"
                                                            >
                                                                City
                                                            </FieldLabel>
                                                            <span className="text-[#7e56d8] text-sm font-medium leading-tight">
                                                                *
                                                            </span>
                                                        </div>

                                                        <Input
                                                            {...field}
                                                            id="city"
                                                            placeholder="Enter city"
                                                            aria-invalid={fieldState.invalid}
                                                        />

                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </FieldGroup>
                                    </div>
                                </div>
                                <div className="grow shrink basis-0 flex-col justify-start items-start gap-1.5 inline-flex">
                                    <div className="self-stretch flex-col justify-start items-start gap-1.5 flex">
                                        <FieldGroup>
                                            <Controller
                                                name="state"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <div className="justify-start items-start gap-0.5 inline-flex">
                                                            <FieldLabel
                                                                htmlFor="state"
                                                                className="text-[#344053] text-sm font-medium leading-tight"
                                                            >
                                                                State/Province
                                                            </FieldLabel>
                                                            <span className="text-[#7e56d8] text-sm font-medium leading-tight">
                                                                *
                                                            </span>
                                                        </div>

                                                        <Input
                                                            {...field}
                                                            id="state"
                                                            placeholder="Enter state/province"
                                                            aria-invalid={fieldState.invalid}
                                                        />

                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </FieldGroup>
                                    </div>
                                </div>
                                <div className="grow shrink basis-0 flex-col justify-start items-start gap-1.5 inline-flex">
                                    <div className="self-stretch flex-col justify-start items-start gap-1.5 flex">
                                        <FieldGroup>
                                            <Controller
                                                name="pinCode"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <div className="justify-start items-start gap-0.5 inline-flex">
                                                            <FieldLabel
                                                                htmlFor="pinCode"
                                                                className="text-[#344053] text-sm font-medium leading-tight"
                                                            >
                                                                Zip/Postal Code
                                                            </FieldLabel>
                                                            <span className="text-[#7e56d8] text-sm font-medium leading-tight">
                                                                *
                                                            </span>
                                                        </div>

                                                        <Input
                                                            {...field}
                                                            id="zipCode"
                                                            placeholder="Enter zip/postal code"
                                                            aria-invalid={fieldState.invalid}
                                                        />

                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </FieldGroup>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 w-full">
                                <FieldGroup>
                                    <Controller
                                        name="newsletter1"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid} orientation="horizontal" className="flex items-start gap-2 w-full">
                                                <Checkbox
                                                    id="newsletter1"
                                                    checked={field.value}
                                                    onCheckedChange={(val) => field.onChange(val === true)}
                                                    onBlur={field.onBlur}
                                                    className="w-5 h-5 flex-none border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                />

                                                <label htmlFor="newsletter1" className="text-[#475467] text-base font-normal font-['Inter'] leading-normal">
                                                    I accept CPE Warehouse’s{' '}
                                                    <span className="font-bold underline mx-1">Terms</span> and{' '}
                                                    <span className="font-semibold underline mx-1">Privacy Policy</span>
                                                </label>

                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </div>
                            <div className="self-stretch justify-center items-baseline gap-1 inline-flex">
                                <div className="text-[#475467] text-lg font-normal font-['Inter'] leading-7">New to CPE warehouse?</div>
                                <div className="justify-center items-center gap-1.5 flex overflow-hidden">
                                    <div className="text-[#2970fe] text-lg font-semibold font-['Inter'] leading-7">Create profile</div>
                                </div>
                            </div>
                        </div>

                        <div className='w-[95%] mx-auto'>
                            <Button type='submit' className="rounded-full cursor-pointer bg-[#2970fe] hover:bg-[#134ab7] px-5 py-3 w-full h-[50px] font-semibold font-['Inter'] leading-7  text-lg" variant="default">
                                Create Account
                            </Button>
                        </div>
                    </div>
                </section>
            </form>
        </Form>

    )
}

export default RegisterForm
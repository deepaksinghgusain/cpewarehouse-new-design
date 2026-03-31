"use client"
import countries from "i18n-iso-countries";
import { Checkbox } from '@/components/ui/checkbox'
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building, Eye, EyeOff, Mail, Phone, UploadCloud } from 'lucide-react'
import ReactCountryFlag from 'react-country-flag'
import z from "zod";
import { Form, FormField, FormItem } from '@/components/ui/form'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { imageUrl } from "@/lib/constants";

export const profileSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    profileImage: z.instanceof(File).optional(),
    username: z.string().min(1, "Username is required"),
    lastName: z.string().min(1, "Last Name is required"),
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
    phone: z.string().min(1, "Phone is required"),
    PTIN: z.string().min(1, "Pcode is required"),
    CFPcode: z.string().min(1, "CFPcode is required"),
    companyName: z.string().min(1, "Company Name is required"),
    address1: z.string().min(1, "Address is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    pinCode: z.string().min(1, "Pincode is required"),
    newsletter1: z.boolean()
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm = () => {
    const countryList = Object.entries(countries.getNames("en"));
    const [show, setShow] = useState(false)

    const [isPending, startTransition] = useTransition()
    const [profileImage, setProfileImage] = useState("")
    const [imagePreview, setImagePreview] = useState("")


    const getUserData = async () => {
        const token = localStorage.getItem("token")

        if (!token) return;

        let response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/users/me", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        let res = await response.json();

        form.reset(res)

        setProfileImage(res.profileImage.url);
    }

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "",
            username: "",
            lastName: "",
            phone: "",
            email: "",
            password: "",
            PTIN: "",
            CFPcode: "",
            companyName: "",
            address1: "",
            country: "",
            city: "",
            state: "",
            pinCode: "",
            newsletter1: false,
            profileImage: undefined
        },
    });


    const onSubmit: SubmitHandler<z.infer<typeof profileSchema>> = async (values: any) => {

        startTransition(async () => {
            const token = localStorage.getItem("token")

            let formData = new FormData()

            for (const field in values) {
                formData.append(field, values[field])
            }


            let response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/profile", {
                method: "PUT",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });

            let res = await response.json();
            console.log(res);

        })
    }

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <Form {...form}>
            <form className='space-y-4 mt-10' onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}>

                <div className="w-full self-stretch pt-8 pb-12 bg-white inline-flex flex-col justify-start items-start gap-8 overflow-hidden">
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                        <div className="self-stretch px-8 flex flex-col justify-start items-start gap-6">
                            <div className="self-stretch flex flex-col justify-start items-start gap-5">
                                <div className="self-stretch inline-flex justify-start items-start gap-4 flex-wrap content-start">
                                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                                        <div className="self-stretch justify-start text-gray-900 text-3xl font-semibold font-['Inter'] leading-9">Edit Profile</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                        <div className="self-stretch px-8 flex flex-col justify-start items-start gap-6">
                            <div className="self-stretch flex flex-col justify-start items-start gap-5">
                                <div className="self-stretch inline-flex justify-start items-start gap-4">
                                    <div className="flex-1 self-stretch inline-flex flex-col justify-center items-start gap-1">
                                        <div className="self-stretch justify-start text-gray-900 text-lg font-semibold font-['Inter'] leading-7">Customer information</div>
                                        <div className="self-stretch justify-start text-slate-600 text-sm font-normal font-['Inter'] leading-5 line-clamp-1">Update your photo and personal details here.</div>
                                    </div>
                                </div>
                                <div className="self-stretch h-px bg-gray-200" />
                            </div>
                            <div className="self-stretch inline-flex justify-start items-start gap-5">
                                <div className="w-16 h-16 relative rounded-[200px]">
                                    <div className="w-16 h-16 left-0 top-0 absolute opacity-10 rounded-[200px] border-[0.75px] border-black">
                                        <img src={imagePreview ? imagePreview :  imageUrl + profileImage} />
                                    </div>
                                </div>
                                <div className="flex-1 inline-flex flex-col justify-start items-start gap-4">
                                    <div className="self-stretch px-6 py-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-start items-center gap-1">
                                        <div className="self-stretch flex flex-col justify-start items-center gap-3">
                                            <div className="w-10 h-10 relative bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] ">
                                                <div className="w-5 h-5 left-[10px] top-[10px] absolute overflow-hidden">
                                                    <div className="w-4 h-3.5 left-[1.67px] top-[2.50px] absolute">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="17" viewBox="0 0 19 17" fill="none">
                                                            <path d="M5.83337 11.6666L9.16671 8.33325M9.16671 8.33325L12.5 11.6666M9.16671 8.33325V15.8333M15.8334 12.2856C16.8513 11.445 17.5 10.1732 17.5 8.74992C17.5 6.21861 15.448 4.16659 12.9167 4.16659C12.7346 4.16659 12.5643 4.07158 12.4718 3.9147C11.3851 2.07062 9.37873 0.833252 7.08337 0.833252C3.63159 0.833252 0.833374 3.63147 0.833374 7.08325C0.833374 8.80501 1.52958 10.3642 2.65583 11.4945" stroke="#475467" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="self-stretch flex flex-col justify-start items-center gap-1">
                                                <FormField
                                                    control={form.control}
                                                    name="profileImage"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <label className="cursor-pointer flex flex-col items-center">
                                                                <div className="flex justify-center items-center gap-1.5 overflow-hidden">
                                                                    <div className="justify-start text-indigo-600 text-sm font-semibold font-['Inter'] leading-5">Click to upload</div>
                                                                </div>
                                                                <div className="justify-start text-slate-600 text-sm font-normal font-['Inter'] leading-5">or drag and drop</div>
                                                                <div className="self-stretch text-center justify-start text-slate-600 text-xs font-normal font-['Inter'] leading-4">SVG, PNG, JPG or GIF (max. 800x400px)</div>


                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];

                                                                        if (!file) return; // important check

                                                                        field.onChange(file);

                                                                        const previewUrl = URL.createObjectURL(file);
                                                                        setImagePreview(previewUrl);

                                                                        console.log(previewUrl);

                                                                    }}
                                                                />
                                                            </label>
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* <FormField control={form.control} name="profileImage" render={({ field }) => (
                                                    <FormItem className="flex flex-col gap-4">
                                                        <label className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center cursor-pointer bg-white hover:shadow-lg transition">
                                                            <UploadCloud className="text-emerald-500 mb-2" />
                                                        
                                                            <input

                                                                type="file"
                                                                multiple
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    if (!e.target.files) return;
                                                                    const files = Array.from(e.target.files);
                                                                    const current = field.value || [];
                                                                    field.onChange(files[0]);
                                                                }}
                                                            />
                                                        </label>
                                                    </FormItem>
                                                )} /> */}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start gap-5">
                                <div className="self-stretch inline-flex justify-start items-start gap-8 flex-wrap content-start">
                                    <div className="flex-1 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col justify-start items-start overflow-hidden">
                                        <div className="self-stretch p-6 bg-white flex flex-col justify-start items-start gap-6">
                                            <div className="self-stretch inline-flex justify-start items-start gap-6">
                                                <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                                                    <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                        <FieldGroup>
                                                            <Controller
                                                                name="firstName"
                                                                control={form.control}
                                                                render={({ field, fieldState }: any) => (
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
                                                <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                                                    <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
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
                                            </div>
                                            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                    <FieldGroup>
                                                        <Controller
                                                            name="phone"
                                                            control={form.control}
                                                            render={({ field, fieldState }) => (
                                                                <Field data-invalid={fieldState.invalid}>


                                                                    <div className="justify-start items-start gap-0.5 inline-flex">
                                                                        <FieldLabel
                                                                            htmlFor="phone"
                                                                            className="text-[#344054] text-lg font-medium leading-7"
                                                                        >
                                                                            Phone
                                                                        </FieldLabel>
                                                                        <span className="text-[#7e56d8] text-sm font-medium leading-tight">
                                                                            *
                                                                        </span>
                                                                    </div>

                                                                    <div className="relative w-full">
                                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                                                        <Input
                                                                            {...field}
                                                                            id="phone"
                                                                            placeholder="Enter your phone"
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
                                            </div>
                                            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
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
                                            </div>
                                            <div className="self-stretch inline-flex justify-start items-start gap-8 flex-wrap content-start">
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
                                            </div >
                                        </div >
                                        <div className="self-stretch pb-4 flex flex-col justify-start items-center gap-4">
                                            <div className="self-stretch h-px bg-gray-200" />
                                            <div className="self-stretch px-6 inline-flex justify-end items-center gap-4">
                                                <div className="flex-1 flex justify-end items-center gap-3">
                                                    <div className="px-4 py-3 bg-indigo-600 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10 flex justify-center items-center gap-1.5 overflow-hidden">
                                                        <div className="px-0.5 flex justify-center items-center">
                                                            <div className="justify-start text-white text-base font-semibold font-['Inter'] leading-6">Change password</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                </div >
                                <div className="self-stretch h-px bg-gray-200" />
                                <div className="self-stretch inline-flex justify-start items-start gap-8 flex-wrap content-start">
                                    <div className="flex-1 max-w-72 min-w-48 inline-flex flex-col justify-start items-start">
                                        <div className="inline-flex justify-start items-center gap-0.5">
                                            <div className="justify-start text-gray-900 text-lg font-semibold font-['Inter'] leading-7">Additional information</div>
                                            <div className="justify-start text-violet-500 text-sm font-semibold font-['Inter'] leading-5">*</div>
                                        </div>
                                    </div>
                                </div >
                                <div className="self-stretch h-px bg-gray-200" />
                                <div className="self-stretch inline-flex justify-start items-start gap-8 flex-wrap content-start">
                                    <div className="flex-1 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col justify-start items-start overflow-hidden">
                                        <div className="self-stretch p-6 bg-white flex flex-col justify-start items-start gap-6">
                                            <div className="self-stretch inline-flex justify-start items-start gap-6">
                                                <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                                                    <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                        <FieldGroup>
                                                            <Controller
                                                                name="PTIN"
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
                                                <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                                                    <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
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
                                            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                    <FieldGroup>
                                                        <Controller
                                                            name="companyName"
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
                                            </div>
                                            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
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
                                            </div >
                                            <div className="self-stretch inline-flex justify-start items-start gap-6">
                                                <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                                                    <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
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
                                                <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5" >
                                                    <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
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
                                                </div >
                                                <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5" >
                                                    <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
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
                                                </div >
                                            </div >
                                            <div className="self-stretch inline-flex justify-center items-center gap-2 overflow-hidden" >
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
                                            </div >
                                            <div className="self-stretch inline-flex justify-start items-start gap-6">
                                                <div className="text-center justify-start"><span className="text-zinc-900 text-base font-normal font-['Manrope'] leading-5">*By click on &quot;Save Changes&quot;, I agree  Asterid Group Inc., dba CPE  Warehouse </span><span className="text-zinc-900 text-base font-bold font-['Manrope'] underline leading-5">Terms</span><span className="text-zinc-900 text-base font-normal font-['Manrope'] leading-5"> and </span><span className="text-zinc-900 text-base font-bold font-['Manrope'] underline leading-5">Privacy Policy</span></div>
                                            </div>
                                        </div >
                                        <div className="self-stretch pb-4 flex flex-col justify-start items-center gap-4">
                                            <div className="self-stretch h-px bg-gray-200" />
                                            <Button type='submit' className="rounded-full cursor-pointer bg-[#2970fe] hover:bg-[#134ab7] px-5 py-3 w-full h-[50px] font-semibold font-['Inter'] leading-7  text-lg" variant="default">
                                                Create Account
                                            </Button>
                                        </div>
                                    </div >
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </form>
        </Form>
    )
}

export default ProfileForm
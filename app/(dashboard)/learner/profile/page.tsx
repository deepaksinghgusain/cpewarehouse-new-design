import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building, Mail, Phone } from 'lucide-react'
import React from 'react'
import ReactCountryFlag from 'react-country-flag'
import countries from "i18n-iso-countries";
import { Checkbox } from '@/components/ui/checkbox'
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const ProfilePage = () => {
    const countryList = Object.entries(countries.getNames("en"));

    return (
        <>
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
                                <div className="w-16 h-16 left-0 top-0 absolute opacity-10 rounded-[200px] border-[0.75px] border-black" />
                            </div>
                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-4">
                                <div className="self-stretch px-6 py-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-start items-center gap-1">
                                    <div className="self-stretch flex flex-col justify-start items-center gap-3">
                                        <div className="w-10 h-10 relative bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] outline outline-1 outline-offset-[-1px] outline-gray-200 overflow-hidden">
                                            <div className="w-5 h-5 left-[10px] top-[10px] absolute overflow-hidden">
                                                <div className="w-4 h-3.5 left-[1.67px] top-[2.50px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-slate-600" />
                                            </div>
                                        </div>
                                        <div className="self-stretch flex flex-col justify-start items-center gap-1">
                                            <div className="self-stretch inline-flex justify-center items-start gap-1">
                                                <div className="flex justify-center items-center gap-1.5 overflow-hidden">
                                                    <div className="justify-start text-indigo-600 text-sm font-semibold font-['Inter'] leading-5">Click to upload</div>
                                                </div>
                                                <div className="justify-start text-slate-600 text-sm font-normal font-['Inter'] leading-5">or drag and drop</div>
                                            </div>
                                            <div className="self-stretch text-center justify-start text-slate-600 text-xs font-normal font-['Inter'] leading-4">SVG, PNG, JPG or GIF (max. 800x400px)</div>
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
                                                    <div className="inline-flex justify-start items-start gap-0.5">
                                                        <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-5">First name</div>
                                                        <div className="justify-start text-violet-500 text-sm font-medium font-['Inter'] leading-5">*</div>
                                                    </div>
                                                    <Input />
                                                </div>
                                            </div>
                                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                                                <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                    <div className="inline-flex justify-start items-start gap-0.5">
                                                        <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-5">Last name</div>
                                                        <div className="justify-start text-violet-500 text-sm font-medium font-['Inter'] leading-5">*</div>
                                                    </div>
                                                    <Input />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                <div className="inline-flex justify-start items-start gap-0.5">
                                                    <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-5">Phone </div>
                                                    <div className="justify-start text-violet-500 text-sm font-medium font-['Inter'] leading-5">*</div>
                                                </div>
                                                <div className="relative w-full">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                <div className="inline-flex justify-start items-start gap-0.5">
                                                    <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-5">Email address</div>
                                                </div>
                                                <div className="relative w-full">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                                    <Input />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="self-stretch inline-flex justify-start items-start gap-8 flex-wrap content-start">
                                            <div className="flex-1 max-w-72 min-w-48 inline-flex flex-col justify-start items-start">
                                                <div className="inline-flex justify-start items-center gap-0.5">
                                                    <div className="justify-start text-slate-700 text-sm font-semibold font-['Inter'] leading-5">Password</div>
                                                    <div className="justify-start text-violet-500 text-sm font-semibold font-['Inter'] leading-5">*</div>
                                                </div>
                                            </div>
                                            <div className="flex-1 w-full min-w-[480px] inline-flex flex-col justify-start items-start gap-1.5">
                                                <Input />
                                            </div>
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
                                                    <div className="inline-flex justify-start items-start gap-0.5">
                                                        <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-5">PTIN# (for Enrolled Agents only)</div>
                                                        <div className="justify-start text-violet-500 text-sm font-medium font-['Inter'] leading-5">*</div>
                                                    </div>
                                                    <Input />
                                                </div>
                                            </div>
                                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                                                <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                    <div className="inline-flex justify-start items-start gap-0.5">
                                                        <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-5">CFP ID#(for CFP designation holders only)</div>
                                                        <div className="justify-start text-violet-500 text-sm font-medium font-['Inter'] leading-5">*</div>
                                                    </div>
                                                    <Input />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                <div className="inline-flex justify-start items-start gap-0.5">
                                                    <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-5">Company Name</div>
                                                    <div className="justify-start text-violet-500 text-sm font-medium font-['Inter'] leading-5">*</div>
                                                </div>
                                                <div className="relative w-full">
                                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                                    <Input />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                <div className="inline-flex justify-start items-start gap-0.5">
                                                    <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-5">Billing Address</div>
                                                    <div className="justify-start text-violet-500 text-sm font-medium font-['Inter'] leading-5">*</div>
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

                                                    <Input />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="self-stretch inline-flex justify-start items-start gap-8 flex-wrap content-start">
                                            <div className="flex-1 max-w-72 min-w-48 inline-flex flex-col justify-start items-start">
                                                <div className="inline-flex justify-start items-center gap-0.5">
                                                    <div className="justify-start text-slate-700 text-sm font-semibold font-['Inter'] leading-5">Country</div>
                                                </div>
                                            </div>
                                            <div className="flex-1 max-w-[512px] min-w-[480px] inline-flex flex-col justify-start items-start gap-2">
                                                <div className="relative w-full">
                                                    <Select>
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
                                            </div>
                                        </div >
                                        <div className="self-stretch inline-flex justify-start items-start gap-6">
                                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                                                <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                    <div className="inline-flex justify-start items-start gap-0.5">
                                                        <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-5">City</div>
                                                        <div className="justify-start text-violet-500 text-sm font-medium font-['Inter'] leading-5">*</div>
                                                    </div>
                                                    <Input />
                                                </div>
                                            </div>
                                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5" >
                                                <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                    <div className="inline-flex justify-start items-start gap-0.5">
                                                        <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-5">State/Province</div>
                                                        <div className="justify-start text-violet-500 text-sm font-medium font-['Inter'] leading-5">*</div>
                                                    </div>
                                                    <Input />
                                                </div>
                                            </div >
                                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5" >
                                                <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                                    <div className="inline-flex justify-start items-start gap-0.5">
                                                        <div className="justify-start text-slate-700 text-sm font-medium font-['Inter'] leading-5">Zip/Postal Code</div>
                                                        <div className="justify-start text-violet-500 text-sm font-medium font-['Inter'] leading-5">*</div>
                                                    </div>
                                                    <Input />
                                                </div>
                                            </div >
                                        </div >
                                        <div className="self-stretch inline-flex justify-center items-center gap-2 overflow-hidden" >
                                            <div className="flex justify-center items-center">
                                                <div className="w-5 h-5 relative bg-Colors-Blue-dark-600 rounded-md overflow-hidden">
                                                    <Checkbox
                                                       
                                                        className="w-5 h-5 flex-none border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1 justify-start text-zinc-900 text-base font-normal font-['Inter'] leading-6"> I agree  Asterid Group Inc., dba CPE  Warehouse </div>
                                        </div >
                                        <div className="self-stretch inline-flex justify-start items-start gap-6">
                                            <div className="text-center justify-start"><span className="text-zinc-900 text-base font-normal font-['Manrope'] leading-5">*By click on &quot;Save Changes&quot;, I agree  Asterid Group Inc., dba CPE  Warehouse </span><span className="text-zinc-900 text-base font-bold font-['Manrope'] underline leading-5">Terms</span><span className="text-zinc-900 text-base font-normal font-['Manrope'] leading-5"> and </span><span className="text-zinc-900 text-base font-bold font-['Manrope'] underline leading-5">Privacy Policy</span></div>
                                        </div>
                                    </div >
                                    <div className="self-stretch pb-4 flex flex-col justify-start items-center gap-4">
                                        <div className="self-stretch h-px bg-gray-200" />
                                        <div className="self-stretch px-6 inline-flex justify-end items-center gap-4">
                                            <div className="flex-1 flex justify-end items-center gap-3">
                                                <div className="px-4 py-3 bg-indigo-600 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10 flex justify-center items-center gap-1.5 overflow-hidden">
                                                    <div className="px-0.5 flex justify-center items-center">
                                                        <div className="justify-start text-white text-base font-semibold font-['Inter'] leading-6">Save Changes</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </div >
        </>
    )
}

export default ProfilePage
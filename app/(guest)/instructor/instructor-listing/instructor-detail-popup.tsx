"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { imageUrl } from "@/lib/constants";

export default function FacultySection({ res }: any) {
    const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
    const [open, setOpen] = useState(false);

    const handleOpen = (faculty: any) => {
        setSelectedFaculty(faculty);
        setOpen(true);
        console.log(faculty);
        
    };

    return (
        <>
            {/* ===== Faculty Grid ===== */}
            <section className="w-[90%] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 py-10">
                    {res?.data?.length > 0 &&
                        res.data.map((faculty: any, index: number) => (
                            <div key={index} className="flex-1 min-w-60 inline-flex flex-col justify-start items-start gap-6">
                                <img className="self-stretch h-72 relative" src={imageUrl + faculty.attributes.image.data.attributes.url} />
                                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                                    <div className="self-stretch flex flex-col justify-start items-start gap-4">
                                        <div className="self-stretch flex flex-col justify-start items-start gap-1">
                                            <div
                                                className="self-stretch justify-start text-Colors-Text-text-primary-(900) text-xl font-semibold font-['Inter'] leading-loose">
                                                {faculty.attributes.firstName}
                                                {faculty.attributes.lastName}
                                            </div>
                                            <div
                                                className="self-stretch justify-start text-Colors-Text-text-brand-secondary-(700) text-lg font-normal font-['Inter'] leading-7">
                                                {faculty.attributes?.shortDesc}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cursor-pointer inline-flex justify-center items-center gap-2 overflow-hidden">
                                        <div className="justify-start text-[#2970FE] text-base font-semibold font-['Inter'] leading-normal" onClick={() => handleOpen(faculty)}>Read Bio</div>
                                        <div className="w-5 h-5 relative overflow-hidden">

                                            <div>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g id="arrow-right">
                                                        <path id="Icon"
                                                            d="M4.16797 9.99999H15.8346M15.8346 9.99999L10.0013 4.16666M15.8346 9.99999L10.0013 15.8333"
                                                            stroke="#2970FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </section>

            {/* ===== Dialog ===== */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white !fixed !inset-[0px] !max-w-none rounded-2xl !translate-x-0 !translate-y-0 top-0 left-0 rounded-none z-100 overflow-y-auto">
                    <div className="">
                        <div className="w-full p-8 inline-flex flex-col justify-start items-start gap-6">
                            <div className="self-stretch inline-flex justify-start items-start gap-6">
                                <div className="w-40 h-40 relative rounded-full">
                                    <div
                                        className="w-40 h-40 left-0 top-0 absolute rounded-full shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08)]  outline-4 overflow-hidden">
                                        <div
                                            className="w-40 h-40 left-0 top-0 absolute rounded-full border border-Component-colors-Components-Avatars-avatar-contrast-border/10">
                                            <img src={imageUrl + selectedFaculty?.attributes?.image?.data?.attributes?.url} alt="" />

                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 py-8 inline-flex flex-col justify-start items-start gap-5">
                                    <div className="self-stretch inline-flex justify-start items-start gap-4 flex-wrap content-start">
                                        <div className="flex-1 min-w-60 inline-flex flex-col justify-start items-start gap-1">
                                            <div
                                                className="self-stretch justify-start text-Colors-Text-text-primary-(900) text-3xl font-semibold font-['Inter'] leading-9">
                                                {selectedFaculty?.attributes?.firstName} {selectedFaculty?.attributes?.lastName}</div>
                                            <div
                                                className="self-stretch justify-start text-Colors-Text-text-tertiary-(600) text-base font-normal font-['Inter'] leading-normal">
                                                {selectedFaculty?.attributes?.shortDesc}</div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="self-stretch inline-flex flex-col justify-start items-start gap-5 border-b w-full">
                                    <div className="self-stretch inline-flex justify-start items-start gap-4 w-full">
                                        <div className="flex-1 self-stretch inline-flex flex-col justify-center items-start gap-1">
                                            <div
                                                className="self-stretch justify-start text-Colors-Text-text-primary-(900) text-lg font-semibold font-['Inter'] leading-7">
                                                Teaches Course Topics</div>
                                            <div className="self-stretch justify-start text-[#475467] text-sm font-normal font-['Inter'] leading-tight">{
                                                selectedFaculty?.attributes?.topics}</div>
                                        </div>
                                    </div>
                                    <div className="self-stretch h-px bg-Colors-Border-border-secondary"></div>
                                </div>

                                <div
                                    className="self-stretch justify-start text-Colors-Text-text-primary-(900) text-base font-medium font-['Inter'] leading-normal mt-10">
                                    Bio</div>

                                <div className="self-stretch justify-start text-[#475467] text-base font-normal font-['Inter'] leading-normal"
                                    dangerouslySetInnerHTML={{ __html: selectedFaculty?.attributes?.bioData }}></div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog >
        </>
    );
}
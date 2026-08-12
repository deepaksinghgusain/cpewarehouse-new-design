"use client";

import React, { useEffect, useState } from 'react'
import { imageUrl } from '@/lib/constants'
import { getPageContent } from '@/services/common';

const FilterCourse = ({ getFilterValues, setFilterValues }: { getFilterValues: any , setFilterValues: any }) => {
    const [filters, setFilters] = useState<any>([]);

    const [filterValue, setFilterValue] = useState<any>({})

    async function getFilters() {
        const res = await getPageContent('course-listing');

        if (res) {
            const filters = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.filters')[0];

            for (let l of filters.list) {

                filterValue[l.name] = null;
            }

            setFilterValue({...filterValue})

            setFilterValues(filterValue)

            setFilters(filters)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedFilter = {
            ...filterValue,
            [e.target.name]: e.target.value,
        };

        setFilterValue(updatedFilter);
        getFilterValues(updatedFilter);
    };

    useEffect(() => {
        getFilters();
    }, [])

    return (
        <div className=" w-full self-start sticky top-[100px]  bg-white rounded-lgshadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08)] border border-[#e4e7ec] flex-col justify-start items-start inline-flex overflow-hidden">
            <div className=" px-3 justify-start items-start inline-flex border-b border-[#e4e7ec] pb-2 w-full">
                <div className="grow shrink basis-0 h-12 pt-2 justify-start items-start gap-4 flex">
                    <div className="w-10 h-10 p-2.5 bg-white rounded-lg  shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-[#e4e7ec] justify-center items-center flex overflow-hidden">
                        <div className="w-5 h-5 relative flex-col justify-start items-start flex overflow-hidden">
                            <img src={imageUrl + filters.icon?.data?.attributes?.url} alt="" />
                        </div>
                    </div>
                    <div className="grow shrink basis-0 flex-col justify-start  items-start gap-1 inline-flex">
                        <div className="self-stretch text-[#101828] text-xl font-semibold font-['Inter'] leading-[30px]">Filters</div>
                    </div>
                </div>
            </div>

            {
                filters.list && filters.list.length > 0 && filters.list.map((filter: any, index: number) => (
                    <div className=" bg-white flex-col justify-start items-start flex border-b border-[#e4e7ec] py-2 w-full" key={index}>
                        <div className="self-stretch px-3 justify-start items-center gap-4 inline-flex overflow-hidden">
                            <div className="w-5 h-5 relative bg-white  overflow-hidden">
                                {
                                    !filter.showChildren ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="chevron-up">
                                            <rect width="20" height="20" fill="white" />
                                            <path id="Icon" d="M15 12.5L10 7.5L5 12.5" stroke="#98A2B3" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <g id="chevron-down">
                                            <rect width="20" height="20" fill="white" />
                                            <path id="Icon" stroke="#98A2B3" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                                        </g>
                                    </svg>
                                }

                            </div>

                            <img src={imageUrl + filter?.icon?.data?.attributes?.url} alt="" />

                            <div className="px-0.5 justify-center items-center flex">
                                <div className="text-[#667085] text-sm font-bold font-['Inter'] leading-tight">{filter.label}</div>
                            </div>
                        </div>
                        <form >
                            <div className="w-full py-1 flex-col justify-start items-start flex overflow-hidden">
                                {
                                    filter?.children?.length > 0 && filter?.children.map((children: any, index: number) => (
                                        <div className="self-stretch px-1.5 py-px justify-start items-center inline-flex" key={index}>
                                            <div className="grow shrink basis-0 h-9 px-2.5 py-[9px] rounded-md justify-start items-center gap-3 flex overflow-hidden">
                                                <div className="grow shrink basis-0 h-[18px] justify-start items-center gap-2 flex">
                                                    <div className="justify-center items-center flex">
                                                        <input type="radio" name={filter.label.toLowerCase().replace(/\s+/g, "_")} value={children.value} onChange={handleChange} />
                                                    </div>
                                                    <div className="grow shrink basis-0 text-[#344054] text-xs font-normal font-['Inter'] leading-[18px]">
                                                        {children.label}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }

                                <div className="self-stretch py-1 justify-start items-center inline-flex"></div>
                            </div>
                        </form>
                    </div>
                ))
            }
        </div>
    )
}

export default FilterCourse
"use client"

import { getCommonData } from '@/services/common';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_END_POINT}`

export const Footer = () => {
  const [footerTop, setFooterTop] = useState<any>({})
  const [footerMiddle, setFooterMiddle] = useState<any>({})
  const [footerBottom, setFooterBottom] = useState<any>({})


  const getFooterData = async () => {
    const response: any = await getCommonData()

    console.log(response);
    

    if (response) {
      setFooterTop(response.data.attributes.footer_top)
      setFooterMiddle(response.data.attributes.footer_middle)
      setFooterBottom(response.data.attributes.footer_bottom)

      console.log(footerTop);
      console.log(footerMiddle);
      console.log(footerBottom);
    }
  }

  useEffect(() => {
    getFooterData();
  }, [])

  return (

    <footer className="bg-gray-50 border-t border-gray-200">
      <div className='w-[90%] mx-auto '>

        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-gray-800">{footerTop.title}</h2>
            <p className="text-sm text-gray-600">
              {footerTop.sub_title}
            </p>
          </div>
          <a href={footerTop?.button?.href}
            className="bg-[#2970fe] text-white text-sm font-medium px-5 py-2 rounded-full shadow hover:bg-indigo-700">
            {footerTop?.button?.label}
          </a>
        </div>




        {
          footerMiddle?.length > 0 &&
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 px-8 py-10 text-sm text-gray-700">
            {
              footerMiddle.map((list: any, index: number) => (
                <div key={index}>
                  <h3 className="text-gray-900 font-medium mb-4">{list.title}</h3>

                  <ul className="space-y-2">
                    {
                      list.item.length > 0 && list.item.map((item: any, index: number) => (
                        <li key={index}>
                          <a href="{{ item.href }}" className="hover:underline">
                            {item.icon.data ? <Image src={ imageUrl + item.icon?.data?.attributes?.url } alt="icon" height={15} width={15}  /> : item.label}
                          </a>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              ))
            }
          </div>
        }


        <div className="flex justify-between items-center px-8 py-6 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            {footerBottom?.image?.data?.attributes?.url && <Image src={imageUrl + footerBottom?.image?.data?.attributes?.url} alt="Logo" height={50} width={200} />}
          </div>
          <p>{footerBottom.copyright}</p>
        </div>
      </div>


    </footer>
  )
}

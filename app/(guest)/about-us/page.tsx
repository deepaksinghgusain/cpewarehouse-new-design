import { imageUrl } from '@/lib/constants';
import { getAboutus } from '@/services/common';
import React from 'react'

const AboutPage = async () => {
  const res = await getAboutus()  

  let aboutFirst: any;
  let commitment: any;
  let values: any;
  let portfolio: any;
  let mission: any;
  let ourTeam: any;
  let ourFaculty: any;

  if (res) {
    aboutFirst = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.about-first')[0]
    commitment = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.commitment')[0]
    values = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.values')[0]
    portfolio = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.portfolio')[0]
    mission = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.mission')[0]
    ourTeam = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.our-team')[0]
    ourFaculty = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.our-faculty')[0]
  }

  return (
    <>
      <section className="mx-auto w-[calc(100%-2rem)] max-w-7xl sm:w-[90%]">
        <div className="flex flex-col items-center gap-10 overflow-hidden py-10 sm:gap-16 sm:py-12">
          <div className="w-full px-0 sm:px-8">
            <div className="self-stretch justify-start items-start gap-8 inline-flex">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-5 inline-flex">
                <div className="self-stretch text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">{aboutFirst?.title}</div>
                <div className="self-stretch text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">{aboutFirst?.description}</div>
              </div>
            </div>
          </div>
          <div className="w-full px-0 sm:px-8">
            <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {
                aboutFirst?.list.length > 0 && aboutFirst.list.map((list: any, index: number) => (
                  <div className="min-w-0" key={index}>
                    <div className="flex flex-col items-start gap-3">
                      <div className="self-stretch text-[#6071f3] text-4xl font-semibold font-['Inter'] leading-[44px]">{list?.Sno}</div>
                      <div className="self-stretch h-[84px] flex-col justify-start items-start gap-2 flex">
                        <div className="self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">{list?.title}</div>
                        <div className="self-stretch text-[#475467] text-base font-normal font-['Inter'] leading-normal">{list?.description}</div>
                      </div>
                    </div>
                  </div>
                ))
              }

            </div>
          </div>
          <div className="w-full px-0 sm:px-8">
            <div className="self-stretch justify-start items-start gap-8 inline-flex">
              <div className="justify-start items-start gap-3 flex">
                <div className="px-[18px] py-3 bg-white rounded-lg shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-[#d0d5dd] justify-center items-center gap-1.5 flex overflow-hidden">
                  <div className="px-0.5 justify-center items-center flex">
                    <div className="text-[#344054] text-base font-semibold font-['Inter'] leading-normal">Asterid Group website</div>
                  </div>
                  <div className="w-5 h-5 relative  overflow-hidden">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5 7.50001L17.5 2.50001M17.5 2.50001H12.5M17.5 2.50001L10 10M8.33333 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V11.6667" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[calc(100%-2rem)] max-w-7xl sm:w-[90%]">
        <div className="flex flex-col items-center gap-12 overflow-hidden bg-white py-10 sm:gap-24 sm:py-12">
          <div className="self-stretch h-11 px-8 flex-col justify-start items-start gap-8 flex">
            <div className="self-stretch h-11 flex-col justify-start items-center gap-8 flex">
              <div className="self-stretch h-11 flex-col justify-start items-center gap-5 flex">
                <div className="self-stretch h-11 flex-col justify-start items-start gap-3 flex">
                  <div className="self-stretch text-center text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">Portfolio</div>
                </div>
              </div>
            </div>
          </div>

          {
            portfolio.Section.length > 0 && portfolio.Section.map((item: any, index: number) => {

              if (index == 0) {
                  return <div key={index} className="about-container-1 flex w-full flex-col items-center gap-10 px-0 py-8 sm:px-8 lg:flex-row lg:gap-24">
                  <div className="grow shrink basis-0 flex-col justify-start items-start gap-8 inline-flex">
                    <div className="self-stretch h-[110px] flex-col justify-start items-start gap-5 flex">
                      <div className="self-stretch h-[110px] flex-col justify-start items-start gap-4 flex">
                        <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">{item.title}</div>
                        <div className="self-stretch text-[#344054] text-lg font-normal font-['Inter'] leading-7">{item?.description}</div>
                      </div>
                    </div>
                    <div className="self-stretch h-64 pl-4 flex-col justify-start items-start gap-5 flex">
                      {
                        item.list.length > 0 && item.list.map((list: any, index: number) => (
                          <div key={index} className="self-stretch justify-start items-start gap-3 inline-flex">
                            <div className="w-7 h-7 rounded-full justify-center items-center flex overflow-hidden">
                              <div className="w-7 h-7 relative flex-col justify-start items-start flex overflow-hidden">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8.7487 13.9999L12.2487 17.4999L19.2487 10.4999M25.6654 13.9999C25.6654 20.4432 20.442 25.6666 13.9987 25.6666C7.55538 25.6666 2.33203 20.4432 2.33203 13.9999C2.33203 7.5566 7.55538 2.33325 13.9987 2.33325C20.442 2.33325 25.6654 7.5566 25.6654 13.9999Z" stroke="#2970FF" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            </div>
                            <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                              <div className="self-stretch">
                                {list.item}
                              </div>
                            </div>
                          </div>
                        ))
                      }

                      <div className="justify-center items-center gap-3 inline-flex overflow-hidden">
                        <div className="text-[#db6803] text-lg font-semibold font-['Inter'] leading-7">Learn more</div>
                        <div className="w-6 h-6 relative  overflow-hidden">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.0002 15.0001V9.00005M15.0002 9.00005H9.00019M15.0002 9.00005L9.00019 14.9999M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="#DC6803" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <img className="h-auto max-h-[512px] w-full max-w-[512px] object-contain" src={imageUrl + item.image.data.attributes.url} alt="" />
                </div>
              }

              if (index == 1) {
                return <div key={index} className="about-container-2 flex w-full flex-col items-center gap-10 px-0 py-8 sm:px-8 lg:flex-row lg:gap-24">
                  <img className="h-auto max-h-[512px] w-full max-w-[512px] object-contain lg:order-first" src={imageUrl + item.image.data.attributes.url} alt="" />
                  <div className="grow shrink basis-0 flex-col justify-start items-start gap-8 inline-flex">
                    <div className="self-stretch h-[110px] flex-col justify-start items-start gap-5 flex">
                      <div className="self-stretch h-[110px] flex-col justify-start items-start gap-4 flex">
                        <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">{item.title}</div>
                        <div className="self-stretch text-[#344054] text-lg font-normal font-['Inter'] leading-7">{item?.description}</div>
                      </div>
                    </div>
                    <div className="self-stretch h-64 pl-4 flex-col justify-start items-start gap-5 flex">
                      {
                        item.list.length > 0 && item.list.map((list: any, index: number) => (
                          <div key={index} className="self-stretch justify-start items-start gap-3 inline-flex">
                            <div className="w-7 h-7 rounded-full justify-center items-center flex overflow-hidden">
                              <div className="w-7 h-7 relative flex-col justify-start items-start flex overflow-hidden">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8.7487 13.9999L12.2487 17.4999L19.2487 10.4999M25.6654 13.9999C25.6654 20.4432 20.442 25.6666 13.9987 25.6666C7.55538 25.6666 2.33203 20.4432 2.33203 13.9999C2.33203 7.5566 7.55538 2.33325 13.9987 2.33325C20.442 2.33325 25.6654 7.5566 25.6654 13.9999Z" stroke="#2970FF" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            </div>
                            <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                              <div className="self-stretch">
                                {list.item}
                              </div>
                            </div>
                          </div>
                        ))
                      }

                      <div className="justify-center items-center gap-3 inline-flex overflow-hidden">
                        <div className="text-[#db6803] text-lg font-semibold font-['Inter'] leading-7">Learn more</div>
                        <div className="w-6 h-6 relative  overflow-hidden">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.0002 15.0001V9.00005M15.0002 9.00005H9.00019M15.0002 9.00005L9.00019 14.9999M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="#DC6803" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              }

              if (index == 2) {
                return <div key={index} className="about-container-3 flex w-full flex-col items-center gap-10 px-0 py-8 sm:px-8 lg:flex-row lg:gap-24">
                  <div className="grow shrink basis-0 flex-col justify-start items-start gap-8 inline-flex">
                    <div className="self-stretch h-[110px] flex-col justify-start items-start gap-5 flex">
                      <div className="self-stretch h-[110px] flex-col justify-start items-start gap-4 flex">
                        <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">{item.title}</div>
                        <div className="self-stretch text-[#344054] text-lg font-normal font-['Inter'] leading-7">{item?.description}</div>
                      </div>
                    </div>
                    <div className="self-stretch h-64 pl-4 flex-col justify-start items-start gap-5 flex">
                      {
                        item.list.length > 0 && item.list.map((list: any, index: number) => (
                          <div className="self-stretch justify-start items-start gap-3 inline-flex">
                            <div className="w-7 h-7 rounded-full justify-center items-center flex overflow-hidden">
                              <div className="w-7 h-7 relative flex-col justify-start items-start flex overflow-hidden">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8.7487 13.9999L12.2487 17.4999L19.2487 10.4999M25.6654 13.9999C25.6654 20.4432 20.442 25.6666 13.9987 25.6666C7.55538 25.6666 2.33203 20.4432 2.33203 13.9999C2.33203 7.5566 7.55538 2.33325 13.9987 2.33325C20.442 2.33325 25.6654 7.5566 25.6654 13.9999Z" stroke="#2970FF" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            </div>
                            <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
                              <div className="self-stretch">
                                {list.item}
                              </div>
                            </div>
                          </div>
                        ))
                      }

                      <div className="justify-center items-center gap-3 inline-flex overflow-hidden">
                        <div className="text-[#db6803] text-lg font-semibold font-['Inter'] leading-7">Learn more</div>
                        <div className="w-6 h-6 relative  overflow-hidden">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.0002 15.0001V9.00005M15.0002 9.00005H9.00019M15.0002 9.00005L9.00019 14.9999M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="#DC6803" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <img className="h-auto max-h-[512px] w-full max-w-[512px] object-contain" src={imageUrl + item.image.data.attributes.url} alt="" />
                </div>
              }
            })
          }
        </div>
      </section>

      <section className="mx-auto w-[calc(100%-2rem)] max-w-7xl sm:w-[90%]">
        <div className="flex flex-col items-center gap-10 overflow-hidden bg-white py-12 sm:gap-16 sm:py-24">
          <div className="w-full px-0 sm:px-8">
            <div className="self-stretch justify-between items-start inline-flex">
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-5 inline-flex">
                <div className="self-stretch h-11 flex-col justify-start items-start gap-3 flex">
                  <div className="self-stretch text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">{mission.title}</div>
                </div>
                <div className="self-stretch text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">{mission?.description}</div>
              </div>
              <div className="justify-start items-start gap-3 flex">
                <div className="px-[18px] py-3 bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 flex overflow-hidden">
                  <div className="px-0.5 justify-center items-center flex">
                    <div className="text-white text-base font-semibold font-['Inter'] leading-normal">View Course catalouge</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-0 sm:px-8">
            <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:gap-16">
              <div className="w-full min-w-0 lg:w-1/2">
                <div className="self-stretch h-[168px] flex-col justify-start items-start flex">
                  <div className="self-stretch"><span className="text-[#475467] text-lg font-normal font-['Inter'] leading-7">{mission.about}</span></div>
                </div>
                {
                  mission.item.length > 0 && mission.item.map((item: any, index: number) => (
                    <div key={index}>
                      <div className="self-stretch h-[136px] flex-col justify-start items-start flex" key={index}>
                        <div className="self-stretch h-10"></div>
                        <div className="self-stretch text-[#101828] text-3xl font-semibold font-['Inter'] leading-[38px]">{item.title}</div>
                        <div className="self-stretch h-5"></div>
                      </div>
                      <div className="self-stretch h-[196px] flex-col justify-start items-start flex">
                        <div className="self-stretch"><span className="text-[#475467] text-lg font-normal font-['Inter'] leading-7">{item?.description}</span></div>
                      </div>
                    </div>

                  ))
                }
              </div>
              <div className="w-full lg:w-1/2">
                <img className="h-auto max-h-[560px] w-full object-contain" src={imageUrl + mission.image.data.attributes.url} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#6071f3]">
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-10 overflow-hidden py-12 sm:gap-16 sm:py-24">
            <div className="w-full px-4 sm:px-8">
              <div className="self-stretch h-[94px] flex-col justify-start items-center gap-12 flex">
                <div className="self-stretch h-[94px] flex-col justify-start items-center gap-5 flex">
                  <div className="self-stretch h-11 flex-col justify-start items-start gap-3 flex">
                    <div className="self-stretch text-center text-white text-4xl font-semibold font-['Inter'] leading-[44px]">{commitment.title}</div>
                  </div>
                  <div className="self-stretch text-center text-white text-xl font-normal font-['Inter'] leading-[30px]">{commitment?.description}</div>
                </div>
              </div>
            </div>
            <div className="w-full px-4 sm:px-8">
              <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {
                  commitment.list.length > 0 && commitment.list.map((item: any, index: number) => (
                    <div className="min-w-0" key={index}>
                      <div className="w-12 h-12 p-3 bg-white rounded-[10px]  shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-[#e4e7ec] justify-center items-center inline-flex overflow-hidden">
                        <div className="w-6 h-6 relative flex-col justify-start items-start flex overflow-hidden">
                          <img src={imageUrl + item?.image?.data?.attributes.url} alt="" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="self-stretch text-center text-white text-xl font-semibold font-['Inter'] leading-[30px]">{item.title}</div>
                        <div className="self-stretch text-center text-white text-base font-normal font-['Inter'] leading-normal">{item?.description}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[calc(100%-2rem)] max-w-7xl sm:w-[90%]">
        <div className="flex w-full flex-col items-center gap-10 overflow-hidden bg-white py-12 sm:gap-16 sm:py-24">
          <div className="w-full px-0 sm:px-8">
            <div className="self-stretch h-[124px] flex-col justify-start items-start gap-12 flex">
              <div className="self-stretch h-[124px] flex-col justify-start items-start gap-5 flex">
                <div className="self-stretch h-11 flex-col justify-start items-start gap-3 flex">
                  <div className="self-stretch text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">{values.title}</div>
                </div>
                <div className="self-stretch text-[#475467] text-xl font-normal font-['Inter'] leading-[30px]">{values.description}.</div>
              </div>
            </div>
          </div>
          <div className="w-full px-0 sm:px-8">
            <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {values.list.length > 0 && values.list.map((item: any, index: number) => (
                <div className="flex-col justify-start items-start" key={index}>
                  <div className="w-12 h-12 p-3 bg-white rounded-[10px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border border-[#e4e7ec] justify-center items-center inline-flex overflow-hidden">
                    <div className="w-6 h-6 relative flex-col justify-start items-start flex overflow-hidden">
                      <img src={imageUrl + item.image?.data?.attributes.url} alt="" />
                    </div>
                  </div>
                  <div className="self-stretch flex-col justify-start items-start gap-2 flex">
                    <div className="self-stretch mt-5 text-[#101828] text-xl font-semibold font-['Inter'] leading-[30px]">{item.title}</div>
                    <div className="self-stretch text-[#475467] text-base font-normal font-['Inter'] leading-normal ">{item?.description}</div>
                  </div>
                </div>
              ))}

              <div className="self-stretch min-w-80 py-24 inline-flex flex-col justify-start items-start gap-5">
                <div className="px-4 py-3  rounded-lg   outline-1 outline-offset-[-1px] outline-[#d0d5dd] inline-flex justify-center items-center gap-1.5 overflow-hidden">
                  <div className="px-0.5 flex justify-center items-center">
                    <div className="justify-start text-Component-colors-Components-Buttons-Secondary-button-secondary-fg text-base font-semibold font-['Inter'] leading-normal">Discover the Impact We've Made!</div>
                  </div>
                  <div className="w-5 h-5 relative overflow-hidden">
                    <div className="w-3 h-3 left-[4.17px] absolute">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.16797 9.99996H15.8346M15.8346 9.99996L10.0013 4.16663M15.8346 9.99996L10.0013 15.8333" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[calc(100%-2rem)] max-w-7xl sm:w-[90%]">
        <div className="flex w-full flex-col items-center justify-center gap-10 overflow-hidden bg-white py-12 sm:gap-16 sm:py-24">
          <div className="w-full px-0 sm:px-8">
            <div className="flex w-full flex-col items-stretch overflow-hidden rounded-3xl bg-gray-50 lg:flex-row">
              <div className="flex flex-1 flex-col items-start justify-center gap-8 p-6 sm:p-16">
                <div className="flex flex-col items-start gap-8">
                  <div className="flex flex-col items-start gap-6">
                    <div className="self-stretch text-[#101828] text-4xl font-medium font-['Inter'] leading-[44px]">{ourFaculty?.title}</div>
                  </div>
                  <div className="px-[18px] py-3 bg-[#2970fe] rounded-[28px] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] border-2 border-white justify-center items-center gap-1.5 inline-flex overflow-hidden">
                    <div className="px-0.5 justify-center items-center flex">
                      <a href="{{ ourFaculty?.button?.href }}" className="text-white text-base font-semibold font-['Inter'] leading-normal">
                        {ourFaculty?.button?.label}</a>
                    </div>
                  </div>
                </div>
              </div>
              <img className="h-auto max-h-[448px] w-full object-cover lg:w-[480px]" src={imageUrl + ourFaculty.image.data.attributes.url} alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[calc(100%-2rem)] max-w-7xl sm:w-[90%]">
        <div className="flex flex-col items-center gap-10 overflow-hidden bg-Colors-Background-bg-primary py-12 sm:gap-16 sm:py-24">
          <div className="w-full px-0 sm:px-8">
            <div className="self-stretch flex flex-col justify-start items-center gap-8">
              <div className="w-full max-w-[768px] flex flex-col justify-start items-center gap-5">
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                  <div className="self-stretch text-center justify-start text-Colors-Text-text-primary-(900) text-4xl font-semibold font-['Inter'] leading-10">{ourTeam.title}</div>
                </div>
                <div className="self-stretch text-center justify-start text-Colors-Text-text-tertiary-(600) text-xl font-normal font-['Inter'] leading-loose">{ourTeam.description}</div>
              </div>
            </div>
          </div>
          <div className="w-full px-0 sm:px-8">
            <div className="grid w-full grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {ourTeam.team.length > 0 && ourTeam.team.map((team: any, index: number) => (
                <div className="flex-1 min-w-60 inline-flex flex-col justify-start items-center gap-5" key={index}>
                  <div className="w-24 h-24 relative rounded-full">
                    <div className="w-24 h-24 left-0 top-0 absolute rounded-full border-[0.75px] border-Component-colors-Components-Avatars-avatar-contrast-border/10">
                      <img src={ imageUrl + team.image.data.attributes.url } alt="" />
                    </div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-center gap-4">
                    <div className="self-stretch flex flex-col justify-start items-center gap-2">
                      <div className="self-stretch flex flex-col justify-start items-center">
                        <div className="self-stretch opacity-90 text-center justify-start text-Colors-Text-text-primary-(900) text-lg font-semibold font-['Inter'] leading-7">{team.name}</div>
                        <div className="self-stretch text-center justify-start text-Colors-Text-text-brand-secondary-(700) text-base font-normal font-['Inter'] leading-normal">{team.designation}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
import { getCommonData, getPageContent } from '@/services/common'
import Link from 'next/link'
import RegisterForm from './register-form'

const RegisterPage = async () => {
    let logo = "";

    const response: any = await getCommonData()

    logo = `${process.env.NEXT_PUBLIC_IMAGE_END_POINT}` + response?.data?.attributes?.headerLogo?.data?.attributes?.url;

    const res = await getPageContent('login');

    let heroImageSection: any;

    if (res) {
        heroImageSection = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.login-page-banner')[0];
    }

    return (
        <>
            <section>
                <div className="inline-flex max-w-full justify-start items-start py-5">
                    <Link href="/" className="inline-flex max-w-full flex-col items-start justify-start px-5">
                       {
                         logo &&  <img className="w-full h-full" src={ logo  } />
                       }
                    </Link>
                </div>
            </section>

            <section className="overflow-x-hidden bg-[#f4f9ff]">
                <div className="container mx-auto w-full px-4 sm:px-6 lg:w-1/2 lg:px-0">
                    <div className="h-auto flex-col justify-center items-center gap-6 inline-flex">
                        <div className="flex h-auto w-full flex-col items-center justify-center gap-6 lg:h-[116px]">
                            <div className="flex h-auto w-full flex-col items-start justify-center gap-6 lg:h-[116px] lg:w-[768px]">
                                <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-6 flex">
                                    <div
                                        className="h-auto w-full rounded-xl py-6 lg:h-[116px] lg:w-[768px]">
                                        <div className="self-stretch h-11 flex-col justify-center items-start gap-6 flex">
                                            <div className="text-[#101828] text-4xl font-semibold font-['Inter'] leading-[44px]">Create Account</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <RegisterForm />
        </>
    )
}

export default RegisterPage
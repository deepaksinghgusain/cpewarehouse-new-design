import { getCommonData, getPageContent } from '@/services/common'
import Link from 'next/link'
import RegisterForm from './register-form'

const RegisterPage = async () => {
    let logo = "http://srv1246425.hstgr.cloud:3000/uploads/CPEW_Logo_230_42_light_bg_f108e1dbca_5125244a0f.png";

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
                <div className="inline-flex justify-start items-start py-5">
                    <Link href="/" className="pl-5 pr-5 inline-flex flex-col justify-start items-start">
                        <img className="w-full h-full" src={ logo  } />
                    </Link>
                </div>
            </section>

            <section className="bg-[#f4f9ff]">
                <div className="container mx-auto w-1/2">
                    <div className="h-auto flex-col justify-center items-center gap-6 inline-flex">
                        <div className="self-stretch h-[116px] flex-col justify-center items-center gap-6 flex">
                            <div className="w-[768px] h-[116px] flex-col justify-center items-start gap-6 flex">
                                <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-6 flex">
                                    <div
                                        className="w-[768px] h-[116px] py-6 rounded-xl flex-col justify-start items-start gap-8 flex overflow-hidden">
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
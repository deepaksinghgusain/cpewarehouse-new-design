import LoginPageComponent from '@/components/login/Login'
import { getPageContent } from '@/services/common';
import Link from 'next/link'

const LoginPage = async () => {

    const res = await getPageContent('login-page');

    let heroImageSection: any;

    if (res) {
        heroImageSection = res?.data[0]?.attributes?.blocks.filter((res: { __component: string; }) => res.__component === 'blocks.login-page-banner')[0];
    }

    return (
        <LoginPageComponent heroImageSection={heroImageSection} />
    )
}

export default LoginPage
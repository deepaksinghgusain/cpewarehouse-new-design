"use client";

import { userLoginRequest } from '@/store/actions/user-actions';
import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const GoogleLoginForm = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();

    useEffect(() => {
        const jwt = searchParams.get('jwt');
        const status = searchParams.get('status');

        if (!jwt || status !== 'success') {
            router.replace('/login');
            return;
        }

        const handleGoogleLogin = async () => {
            const token = jwt;

            document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
            localStorage.setItem('token', token);
            Cookies.set('token', token);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }

                const user = await response.json();

                localStorage.setItem('userData', JSON.stringify(user));
                localStorage.setItem('username', user?.firstName || '');
                localStorage.setItem('lastname', user?.lastName || '');
                localStorage.setItem('userId', String(user?.id || ''));
                localStorage.setItem('email', user?.email || '');

                if (user?.PTIN) {
                    localStorage.setItem('PTIN', user.PTIN);
                }

                dispatch(userLoginRequest(user));

                const callbackUrl = searchParams.get('callbackUrl');
                const destination = callbackUrl ? decodeURIComponent(callbackUrl) : '/learner/dashboard';
                router.replace(destination);
            } catch (error) {
                console.error('Google login callback error', error);
                router.replace('/login');
            }
        };

        handleGoogleLogin();
    }, [dispatch, router, searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
            Logging in...
        </div>
    );
};

const GoogleLogin = () => (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">Logging in...</div>}>
        <GoogleLoginForm />
    </Suspense>
)

export default GoogleLogin
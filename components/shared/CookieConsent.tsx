"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { userInfo } from "@/services/auth";
import { userLogoutRequest } from "@/store/actions/user-actions";
import { useDispatch } from "react-redux";

export default function CookieConsent() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = window.setTimeout(() => setOpen(true), 300);
        return () => window.clearTimeout(timer);
    }, []);

    const handleConsent = async (value: "accepted" | "declined") => {
        document.cookie = `cookieConsent=${value}; path=/; max-age=31536000; SameSite=Lax`;


        if (value === "accepted") {
            dispatch(userLogoutRequest());

            const userData = await userInfo()

            if (!("id" in userData)) {
                localStorage.removeItem('remember');
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('lastname');
                localStorage.removeItem('userId');
                localStorage.removeItem('userData');
                localStorage.removeItem('email');
                localStorage.removeItem('PTIN');
                localStorage.removeItem('rem_email');
                localStorage.removeItem('rem_pass');
                document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
            }

        }

        setOpen(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-x-0 bottom-0 z-[1000] animate-[slideUp_0.35s_ease-out] border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">We use cookies to improve your experience.</p>
                    <p className="mt-1 text-sm text-slate-600">
                        By clicking Accept, you agree to our use of cookies for analytics and personalization.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="default" size="sm" onClick={() => handleConsent("declined")} className="cursor-pointer border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                        Decline
                    </Button>
                    <Button size="sm" variant="default" onClick={() => handleConsent("accepted")} className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600">
                        Accept Cookies
                    </Button>
                </div>
            </div>
        </div>
    );
}

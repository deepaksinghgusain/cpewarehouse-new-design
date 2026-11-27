"use client";

import { useEffect } from "react";

export default function FocusFirstInvalidField() {
    useEffect(() => {
        const handleSubmit = (event: Event) => {
            const form = event.target;
            if (!(form instanceof HTMLFormElement)) return;

            const observer = new MutationObserver(() => focusInvalidField());
            const timeout = window.setTimeout(() => observer.disconnect(), 1500);

            const focusInvalidField = () => {
                if (!form.isConnected) return;

                const invalidField = Array.from(
                    form.querySelectorAll<HTMLElement>("input, select, textarea, button, [role='combobox']")
                ).find((field) => {
                    if (field.hasAttribute("disabled") || field.getAttribute("aria-invalid") === "false") {
                        return false;
                    }

                    return field.getAttribute("aria-invalid") === "true"
                        || field.getAttribute("data-invalid") === "true"
                        || field.matches(":invalid");
                });

                if (!invalidField || invalidField.getClientRects().length === 0) return;

                observer.disconnect();
                window.clearTimeout(timeout);
                invalidField.focus({ preventScroll: true });
                invalidField.scrollIntoView({ behavior: "smooth", block: "center" });
            };

            observer.observe(form, {
                subtree: true,
                attributes: true,
                attributeFilter: ["aria-invalid", "data-invalid"],
            });
            window.setTimeout(focusInvalidField, 0);
        };

        document.addEventListener("submit", handleSubmit, true);
        return () => document.removeEventListener("submit", handleSubmit, true);
    }, []);

    return null;
}

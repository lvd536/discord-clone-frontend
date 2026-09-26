'use client';

import * as React from 'react';

interface AuthInputFieldProps extends React.ComponentProps<'input'> {
    label: string;
    error?: string;
}

export const AuthInputField = React.forwardRef<HTMLInputElement, AuthInputFieldProps>(
    ({ label, error, required, id, className, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div>
                <label
                    htmlFor={inputId}
                    className="mb-1.5 flex items-center gap-1 text-[11px] font-bold tracking-wider text-[#b5bac1] uppercase select-none"
                >
                    {label} {required && <span className="text-[#f23f43]">*</span>}
                </label>
                <input
                    ref={ref}
                    id={inputId}
                    className={`h-10 w-full rounded border bg-[#1e1f22] px-3 text-sm text-[#dbdee1] transition-colors focus:outline-none ${
                        error ? 'border-[#f23f43]' : 'border-black/30 focus:border-[#5865f2]'
                    } ${className || ''}`}
                    {...props}
                />
                {error && (
                    <span className="animate-in fade-in mt-1 block text-xs text-[#f23f43] duration-150">
                        {error}
                    </span>
                )}
            </div>
        );
    },
);

AuthInputField.displayName = 'AuthInputField';
export default AuthInputField;

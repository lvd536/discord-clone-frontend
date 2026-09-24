'use client';

import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'dark' } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            position="bottom-right"
            closeButton
            icons={{
                success: <CircleCheckIcon className="size-4.5 shrink-0 text-[#23a55a]" />,
                info: <InfoIcon className="size-4.5 shrink-0 text-[#5865f2]" />,
                warning: <TriangleAlertIcon className="size-4.5 shrink-0 text-[#fee75c]" />,
                error: <OctagonXIcon className="size-4.5 shrink-0 text-[#f23f43]" />,
                loading: <Loader2Icon className="size-4.5 shrink-0 animate-spin text-[#5865f2]" />,
            }}
            style={
                {
                    '--normal-bg': '#1e1f22',
                    '--normal-border': '#2b2d31',
                    '--normal-text': '#f2f3f5',
                    '--border-radius': '10px',
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: 'group toast !bg-[#1e1f22] !text-[#dbdee1] !border-[#2b2d31] !shadow-2xl !shadow-black/80 !rounded-xl !p-3.5 !gap-3 select-none',
                    title: '!text-white font-semibold text-sm tracking-wide',
                    description: '!text-[#949ba4] text-xs leading-relaxed',
                    actionButton:
                        '!bg-[#5865f2] hover:!bg-[#4752c4] !text-white !text-xs !font-semibold !rounded-md !px-3 !py-1.5 !transition-colors cursor-pointer',
                    cancelButton:
                        '!bg-[#2b2d31] hover:!bg-[#35363c] !text-[#dbdee1] !text-xs !rounded-md !px-3 !py-1.5',
                    closeButton:
                        '!bg-[#111214] !text-[#949ba4] !border-[#2b2d31] hover:!text-white hover:!bg-[#2b2d31] !transition-colors',

                    success: '!border-l-4 !border-l-[#23a55a]',
                    error: '!border-l-4 !border-l-[#f23f43]',
                    info: '!border-l-4 !border-l-[#5865f2]',
                    warning: '!border-l-4 !border-l-[#fee75c]',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };

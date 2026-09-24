'use client';

import { BASE_URL } from '@/features/shared/constants/db.constants';

export default function OAuthProviders() {
    const handleOAuthRedirect = (provider: string) => {
        window.location.href = `${BASE_URL}/auth/${provider}`;
    };

    return (
        <div className="mb-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => handleOAuthRedirect('yandex')}
                    className="flex h-10 cursor-pointer items-center justify-center gap-2.5 rounded bg-[#2b2d31] px-4 py-2 text-sm font-semibold text-[#dbdee1] transition-all duration-150 hover:bg-[#35373c] hover:text-white"
                >
                    <svg
                        className="h-4 w-4 shrink-0 text-red-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12.493 0h3.18L10.35 24H7.13L10.33 11.23 3.65 3.32h3.33l4.63 5.65L12.49 0z" />
                    </svg>
                    <span>Yandex</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleOAuthRedirect('discord')}
                    className="flex h-10 cursor-pointer items-center justify-center gap-2.5 rounded bg-[#2b2d31] px-4 py-2 text-sm font-semibold text-[#dbdee1] transition-all duration-150 hover:bg-[#35373c] hover:text-white"
                >
                    <svg
                        className="h-4 w-4 shrink-0 text-[#5865F2]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.03c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.03A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                    </svg>
                    <span>Discord</span>
                </button>
            </div>

            <div className="relative flex items-center py-1">
                <div className="grow border-t border-[#3f4147]/50"></div>
                <span className="mx-3 shrink text-[11px] font-bold tracking-wider text-[#949ba4] uppercase">
                    Или через почту
                </span>
                <div className="grow border-t border-[#3f4147]/50" />
            </div>
        </div>
    );
}

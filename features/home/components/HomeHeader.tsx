'use client';

import Link from 'next/link';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/features/shared/constants/route.constants';

export default function HomeHeader() {
    const { profile } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-[#1f2023]/60 bg-[#1e1f22]/80 px-6 backdrop-blur-md select-none md:px-16">
            <span className="text-xl font-black tracking-wide text-white">LvdCord</span>

            <div className="flex items-center gap-4">
                {profile ? (
                    <Link
                        href={ROUTES.DASHBOARD.ME.BASE}
                        className="rounded-full bg-[#5865f2] px-5 py-1.5 text-sm font-bold text-white shadow-lg shadow-[#5865f2]/10 transition-all hover:bg-[#4752c4]"
                    >
                        В приложение
                    </Link>
                ) : (
                    <>
                        <Link
                            href={ROUTES.AUTH.LOGIN}
                            className="rounded-full px-5 py-1.5 text-sm font-semibold text-white transition-all hover:bg-[#35373c]"
                        >
                            Войти
                        </Link>
                        <Link
                            href={ROUTES.AUTH.REGISTER}
                            className="rounded-full bg-[#5865f2] px-5 py-1.5 text-sm font-bold text-white shadow-lg shadow-[#5865f2]/10 transition-all hover:bg-[#4752c4]"
                        >
                            Регистрация
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}

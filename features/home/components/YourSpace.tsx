'use client';

import Link from 'next/link';

import { ArrowRight, Sparkles } from 'lucide-react';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/features/shared/constants/route.constants';

export default function YourSpace() {
    const { profile } = useAuthStore();

    return (
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-20 text-center md:px-16 md:py-28">
            <div className="absolute top-20 -left-40 h-96 w-96 rounded-full bg-[#5865f2]/10 blur-3xl" />
            <div className="absolute top-40 -right-40 h-96 w-96 rounded-full bg-[#23a55a]/5 blur-3xl" />

            <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#5865f2]/10 px-3.5 py-1 text-xs font-bold tracking-wide text-[#5865f2] uppercase">
                    <Sparkles className="h-3.5 w-3.5" />
                    WebRTC Клон Discord
                </div>

                <h1 className="text-4xl leading-tight font-black tracking-tight text-white md:text-6xl lg:text-7xl">
                    Твое пространство <br className="hidden sm:inline" />
                    для общения <span className="text-[#5865f2]">без границ</span>
                </h1>

                <p className="mx-auto max-w-xl text-base leading-relaxed text-[#949ba4] md:text-lg">
                    Общайся в текстовых каналах, заходи в голосовые комнаты с друзьями, делись
                    экраном и устраивай видеозвонки. LvdCord — это высокая скорость, безопасность и
                    стабильность связи.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                    <Link
                        href={ROUTES.DASHBOARD.BASE}
                        className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#5865f2] px-8 text-sm font-bold text-white shadow-xl shadow-[#5865f2]/20 transition-all hover:bg-[#4752c4] sm:w-auto"
                    >
                        Открыть LvdCord в браузере
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    {!profile && (
                        <Link
                            href={ROUTES.AUTH.REGISTER}
                            className="flex h-12 w-full items-center justify-center rounded-full border border-[#3f4147]/50 bg-[#2b2d31] px-8 text-sm font-bold text-white transition-all hover:bg-[#35363c] sm:w-auto"
                        >
                            Создать аккаунт
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}

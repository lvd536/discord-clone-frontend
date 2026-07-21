import Link from 'next/link';

import {
    ArrowRight,
    Hash,
    MessageSquare,
    PhoneCall,
    Plus,
    ShieldCheck,
    Sparkles,
    Users,
    Volume2,
} from 'lucide-react';

import { ROUTES } from '@/constants/route.constants';

export default function Home() {
    return (
        <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[#1e1f22] font-sans text-[#dbdee1] selection:bg-[#5865f2]/30">
            <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-[#1f2023]/60 bg-[#1e1f22]/80 px-6 backdrop-blur-md select-none md:px-16">
                <span className="text-xl font-black tracking-wide text-white">LvdCord</span>

                <div className="flex items-center gap-4">
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
                </div>
            </header>

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
                        экраном и устраивай видеозвонки. LvdCord — это высокая скорость,
                        безопасность и стабильность связи.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                        <Link
                            href={ROUTES.DASHBOARD.BASE}
                            className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#5865f2] px-8 text-sm font-bold text-white shadow-xl shadow-[#5865f2]/20 transition-all hover:bg-[#4752c4] sm:w-auto"
                        >
                            Открыть LvdCord в браузере
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href={ROUTES.AUTH.REGISTER}
                            className="flex h-12 w-full items-center justify-center rounded-full border border-[#3f4147]/50 bg-[#2b2d31] px-8 text-sm font-bold text-white transition-all hover:bg-[#35363c] sm:w-auto"
                        >
                            Создать аккаунт
                        </Link>
                    </div>
                </div>
            </section>

            <section className="hidden px-6 pb-20 select-none sm:block md:px-16">
                <div className="mx-auto max-w-5xl rounded-xl border border-[#1f2023]/80 bg-[#2b2d31] p-3 shadow-2xl shadow-black/40">
                    <div className="relative flex aspect-16/10 w-full overflow-hidden rounded-lg border border-[#1f2023]/60 bg-[#313338]">
                        <div className="flex w-16 shrink-0 flex-col items-center gap-2 border-r border-[#1f2023]/20 bg-[#1e1f22] py-3">
                            <div className="mb-4 flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#f23f43]"></span>
                                <span className="h-2.5 w-2.5 rounded-full bg-[#fee75c]"></span>
                                <span className="h-2.5 w-2.5 rounded-full bg-[#23a55a]"></span>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5865f2] text-xs font-bold text-white">
                                DM
                            </div>
                            <div className="my-1 h-0.5 w-8 rounded bg-[#35363c]" />
                            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#23a55a] text-xs font-bold text-white">
                                FI
                            </div>
                            <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-dashed border-[#23a55a]/40 bg-[#313338] text-xs text-[#23a55a] transition-all hover:rounded-[12px] hover:bg-[#23a55a] hover:text-white">
                                <Plus className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="flex w-48 shrink-0 flex-col justify-between border-r border-[#1f2023]/20 bg-[#2b2d31] pt-3">
                            <div className="px-2">
                                <div className="mb-4 flex h-8 items-center rounded-md border border-[#1f2023]/60 bg-[#313338] px-2 text-xs font-bold text-white">
                                    Мой Сервер
                                </div>
                                <div className="space-y-1">
                                    <div className="flex h-8 items-center gap-1.5 rounded bg-[#35363c] px-2 text-xs font-semibold text-[#f2f3f5]">
                                        <Hash className="h-4 w-4 text-[#80848e]" />
                                        <span>флудилка</span>
                                    </div>
                                    <div className="flex h-8 cursor-pointer items-center gap-1.5 rounded px-2 text-xs font-medium text-[#949ba4] hover:bg-[#35363c]/40">
                                        <Hash className="h-4 w-4 text-[#80848e]" />
                                        <span>мемы</span>
                                    </div>
                                    <div className="flex h-8 cursor-pointer items-center gap-1.5 rounded px-2 text-xs font-medium text-[#949ba4] hover:bg-[#35363c]/40">
                                        <Volume2 className="h-4 w-4 text-[#80848e]" />
                                        <span>Lobby</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex h-12 items-center gap-2 border-t border-[#1f2023]/30 bg-[#232428] px-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865f2] text-xs font-bold text-white">
                                    ME
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="truncate text-xs font-bold text-white">
                                        Username
                                    </span>
                                    <span className="text-[10px] text-[#949ba4]">#0000</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-between overflow-hidden bg-[#313338]">
                            <div className="flex h-12 shrink-0 items-center gap-2 border-b border-[#1f2023]/60 bg-[#313338] px-4 text-xs font-bold text-white">
                                <Hash className="h-4 w-4 text-[#80848e]" />
                                <span>флудилка</span>
                            </div>

                            <div className="discord-scroll flex-1 space-y-4 overflow-y-auto p-4">
                                <div className="flex items-start gap-3 text-xs">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5865f2] font-bold text-white">
                                        JD
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="cursor-pointer font-bold text-[#f2f3f5] hover:underline">
                                            John Doe
                                        </span>
                                        <p className="mt-0.5 leading-relaxed text-[#dbdee1]">
                                            Привет всем! Это тестовый чат нашей платформы LvdCord.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 text-xs">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#23a55a] font-bold text-white">
                                        ME
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="cursor-pointer font-bold text-[#f2f3f5] hover:underline">
                                            Username
                                        </span>
                                        <p className="mt-0.5 leading-relaxed text-[#dbdee1]">
                                            Ого, WebRTC звонки и текстовый чат работают без
                                            задержек!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 bg-[#313338] p-4">
                                <div className="flex h-10 items-center rounded-lg bg-[#383a40] px-4 text-xs text-[#80848e]">
                                    Отправить сообщение в #флудилка
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="shrink-0 border-t border-[#1f2023]/60 bg-[#2b2d31] px-6 py-20 md:px-16 md:py-28">
                <div className="mx-auto max-w-5xl space-y-12">
                    <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-black text-white md:text-4xl">
                            Все необходимое для твоей компании
                        </h2>
                        <p className="mx-auto max-w-md text-sm text-[#949ba4]">
                            От личных диалогов до масштабных серверов — LvdCord полностью готов к
                            любым задачам.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="group rounded-2xl border border-[#3f4147]/20 bg-[#313338] p-6 transition-all duration-200 hover:border-[#5865f2]/40">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#5865f2]/10 text-[#5865f2]">
                                <PhoneCall className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-bold text-white transition-colors group-hover:text-[#5865f2]">
                                Голосовые комнаты
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-[#949ba4]">
                                Подключайся к голосовым и видео-каналам в одно касание. Полная
                                поддержка демонстрации экрана и веб-камер.
                            </p>
                        </div>

                        <div className="group rounded-2xl border border-[#3f4147]/20 bg-[#313338] p-6 transition-all duration-200 hover:border-[#5865f2]/40">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#23a55a]/10 text-[#23a55a]">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-bold text-white transition-colors group-hover:text-[#23a55a]">
                                Мгновенный чат
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-[#949ba4]">
                                Переписывайся в текстовых каналах серверов и личных беседах. Низкая
                                задержка WebRTC Data Channels.
                            </p>
                        </div>

                        <div className="group rounded-2xl border border-[#3f4147]/20 bg-[#313338] p-6 transition-all duration-200 hover:border-[#5865f2]/40">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fee75c]/10 text-[#fee75c]">
                                <Users className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-bold text-white transition-colors group-hover:text-[#fee75c]">
                                Друзья и Группы
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-[#949ba4]">
                                Отправляй запросы в друзья, собирай компании и организовывай
                                групповые переписки прямо во вкладке DM.
                            </p>
                        </div>

                        <div className="group rounded-2xl border border-[#3f4147]/20 bg-[#313338] p-6 transition-all duration-200 hover:border-[#5865f2]/40">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f43f5e]/10 text-[#f43f5e]">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-bold text-white transition-colors group-hover:text-[#f43f5e]">
                                Безопасность
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-[#949ba4]">
                                Авторизация по HTTP-only кукам, подтверждение email,
                                OAuth-интеграции (Яндекс, Discord) и JWT-защита сессий.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="mt-auto flex shrink-0 flex-col items-center justify-between gap-4 border-t border-[#1f2023]/60 bg-[#1e1f22] px-6 py-8 text-center text-xs text-[#949ba4] select-none sm:flex-row md:px-16">
                <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-[#5865f2] text-white">
                        <span className="text-xs font-black">L</span>
                    </div>
                    <span className="font-bold text-white">LvdCord</span>
                </div>
                <span>
                    © 2026 LvdCord. Все права защищены. Разработано с использованием LiveKit SFU.
                </span>
            </footer>
        </div>
    );
}

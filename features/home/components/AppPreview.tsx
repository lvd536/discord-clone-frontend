import { Hash, Plus, Volume2 } from 'lucide-react';

export default function AppPreview() {
    return (
        <section className="hidden px-6 pb-20 select-none sm:block md:px-16">
            <div className="mx-auto max-w-5xl rounded-xl border border-[#1f2023]/80 bg-[#2b2d31] p-3 shadow-2xl shadow-black/40">
                <div className="relative flex aspect-16/10 w-full overflow-hidden rounded-lg border border-[#1f2023]/60 bg-[#313338]">
                    <div className="flex w-16 shrink-0 flex-col items-center gap-2 border-r border-[#1f2023]/20 bg-[#1e1f22] py-3">
                        <div className="mb-4 flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#f23f43]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#fee75c]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#23a55a]" />
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
                                        Ого, WebRTC звонки и текстовый чат работают без задержек!
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
    );
}

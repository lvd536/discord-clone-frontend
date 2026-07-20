import { Compass, MessageSquare, Radio, ShieldCheck, Sparkles, Users2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { getServerInfo } from '@/features/server/actions';

interface IProps {
    params: Promise<{ serverId: string }>;
}

export default async function ServerWelcomePage({ params }: IProps) {
    const { serverId } = await params;

    const serverResponse = await getServerInfo(serverId);

    const serverInfo = serverResponse.success ? serverResponse.data : null;

    if (!serverInfo) return null;

    return (
        <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#313338] select-none">
            <div className="relative h-64 w-full shrink-0 overflow-hidden bg-[#1e1f22]">
                <div className="absolute inset-0 bg-linear-to-t from-[#313338] via-[#313338]/40 to-transparent" />

                <div className="absolute bottom-6 left-8 flex items-end gap-4">
                    <Avatar>
                        <AvatarImage src={serverInfo.imageUrl ?? ''} />
                        <AvatarFallback>
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#5865f2] text-3xl font-black text-white shadow-xl ring-4 shadow-[#5865f2]/30 ring-[#313338]">
                                {serverInfo.name.slice(0, 2).toUpperCase()}
                            </div>
                        </AvatarFallback>
                    </Avatar>
                    <div className="mb-1 ml-5">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black tracking-wide text-white drop-shadow-md">
                                {serverInfo.name}
                            </h1>
                            <ShieldCheck className="h-5 w-5 fill-[#23a55a]/20 text-[#23a55a]" />
                        </div>
                        <p className="text-xs font-semibold tracking-wider text-[#b5bac1] uppercase">
                            ID: {serverInfo.id.slice(0, 8)}...
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-6 p-8 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <div className="relative overflow-hidden rounded-2xl border border-[#3f4147]/40 bg-linear-to-br from-[#404249] to-[#2b2d31] p-6 shadow-lg">
                        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#5865f2]/10 blur-2xl" />
                        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                            <Sparkles className="h-5 w-5 text-[#fee75c]" />
                            Добро пожаловать в эпицентр событий!
                        </h2>
                    </div>

                    <div>
                        <h3 className="mb-4 text-xs font-bold tracking-wider text-[#949ba4] uppercase">
                            С чего начать?
                        </h3>
                        <div className="space-y-3">
                            <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-transparent bg-[#2b2d31] p-4 transition-all duration-200 hover:translate-x-1 hover:border-[#5865f2]/30 hover:bg-[#35363c]">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#23a55a]/10 text-[#23a55a]">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white transition-colors group-hover:text-[#5865f2]">
                                            Загляните во флудилку
                                        </h4>
                                        <p className="text-xs text-[#949ba4]">
                                            Поздоровайтесь с другими участниками и найдите компанию.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-[#5865f2] opacity-0 transition-opacity group-hover:opacity-100">
                                    Перейти →
                                </span>
                            </div>

                            <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-transparent bg-[#2b2d31] p-4 transition-all duration-200 hover:translate-x-1 hover:border-[#5865f2]/30 hover:bg-[#35363c]">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#5865f2]/10 text-[#5865f2]">
                                        <Radio className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white transition-colors group-hover:text-[#5865f2]">
                                            Зайдите в голосовой канал
                                        </h4>
                                        <p className="text-xs text-[#949ba4]">
                                            Подключайтесь к Lounge комнате для ламповых разговоров.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-[#5865f2] opacity-0 transition-opacity group-hover:opacity-100">
                                    Перейти →
                                </span>
                            </div>

                            <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-transparent bg-[#2b2d31] p-4 transition-all duration-200 hover:translate-x-1 hover:border-[#5865f2]/30 hover:bg-[#35363c]">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f43f5e]/10 text-[#f43f5e]">
                                        <Compass className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white transition-colors group-hover:text-[#5865f2]">
                                            Ознакомьтесь с правилами
                                        </h4>
                                        <p className="text-xs text-[#949ba4]">
                                            Узнайте, как устроен наш сервер, чтобы избежать банов.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-[#5865f2] opacity-0 transition-opacity group-hover:opacity-100">
                                    Перейти →
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-xl bg-[#2b2d31] p-5 shadow-md">
                        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-[#949ba4] uppercase">
                            <Users2 className="h-4 w-4" />
                            Участники сервера
                        </h3>

                        <div className="flex items-center justify-between border-t border-[#35363c] pt-3">
                            <div className="flex items-center gap-2 text-sm text-[#dbdee1]">
                                <span className="h-2 w-2 rounded-full bg-[#80848e]" />
                                <span>Всего участников</span>
                            </div>
                            <span className="text-sm font-bold text-white">
                                {serverInfo.members.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

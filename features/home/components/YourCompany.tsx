import { MessageSquare, PhoneCall, ShieldCheck, Users } from 'lucide-react';

export default function YourCompany() {
    return (
        <section className="shrink-0 border-t border-[#1f2023]/60 bg-[#2b2d31] px-6 py-20 md:px-16 md:py-28">
            <div className="mx-auto max-w-5xl space-y-12">
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-black text-white md:text-4xl">
                        Все необходимое для твоей компании
                    </h2>
                    <p className="mx-auto max-w-md text-sm text-[#949ba4]">
                        От личных диалогов до масштабных серверов — LvdCord полностью готов к любым
                        задачам.
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
                            Подключайся к голосовым и видео-каналам в одно касание. Полная поддержка
                            демонстрации экрана и веб-камер.
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
                            Отправляй запросы в друзья, собирай компании и организовывай групповые
                            переписки прямо во вкладке DM.
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
                            Авторизация по HTTP-only кукам, подтверждение email, OAuth-интеграции
                            (Яндекс, Discord) и JWT-защита сессий.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

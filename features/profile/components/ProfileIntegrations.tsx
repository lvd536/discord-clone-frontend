import { useAuthStore } from '@/features/auth/store/auth.store';

export default function ProfileIntegrations() {
    const { accounts } = useAuthStore();

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider text-[#949ba4] uppercase">
                Интеграции
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
                {accounts && accounts.length > 0 ? (
                    accounts.map((acc) => (
                        <div
                            key={acc.id}
                            className="flex items-center justify-between rounded-lg border border-[#3f4147]/20 bg-[#2b2d31] p-4 text-sm shadow-sm"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="font-semibold text-white capitalize">
                                    {acc.provider}
                                </span>
                            </div>
                            <span className="rounded bg-[#23a55a]/10 px-2 py-0.5 text-xs font-semibold text-[#23a55a]">
                                Связан
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 rounded-lg border border-dashed border-[#3f4147]/40 bg-[#2b2d31] p-6 text-center text-xs text-[#949ba4] italic">
                        Нет подключенных интеграций. Авторизация производится через почту.
                    </div>
                )}
            </div>
        </div>
    );
}

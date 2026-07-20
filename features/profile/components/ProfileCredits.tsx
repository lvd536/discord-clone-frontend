import { useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { api } from '@/lib/api/api';

export default function ProfileCredits() {
    const { profile } = useAuthStore();
    const [isSendingCode, setIsSendingCode] = useState(false);

    const handleResendVerification = async () => {
        setIsSendingCode(true);
        try {
            await api.post('/auth/send-code');
            toast.success('Код подтверждения отправлен на вашу почту!');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Не удалось отправить код');
        } finally {
            setIsSendingCode(false);
        }
    };

    if (!profile) return null;

    return (
        <div className="mx-6 mt-4 space-y-4 rounded-lg bg-[#2b2d31] p-4">
            <div className="flex items-center justify-between border-b border-[#3f4147]/30 pb-3">
                <div className="space-y-1">
                    <span className="block text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                        Отображаемое имя
                    </span>
                    <span className="text-sm font-medium text-[#f2f3f5]">
                        {profile.displayName}
                    </span>
                </div>
                <Button
                    size="sm"
                    className="cursor-pointer bg-[#4e5058] text-xs font-medium text-white hover:bg-[#6d6f78]"
                >
                    Изменить
                </Button>
            </div>

            <div className="flex items-center justify-between border-b border-[#3f4147]/30 pb-3">
                <div className="space-y-1">
                    <span className="block text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                        Электронная почта
                    </span>
                    <span className="text-sm font-medium text-[#f2f3f5]">{profile.email}</span>
                </div>
                <Button
                    size="sm"
                    className="cursor-pointer bg-[#4e5058] text-xs font-medium text-white hover:bg-[#6d6f78]"
                >
                    Изменить
                </Button>
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <span className="block text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                        Верификация почты
                    </span>
                    <span className="text-sm font-medium text-[#f2f3f5]">
                        {profile.isVerified
                            ? 'Почта успешно подтверждена'
                            : 'Потребуется подтверждение почты'}
                    </span>
                </div>
                {!profile.isVerified ? (
                    <Button
                        size="sm"
                        onClick={handleResendVerification}
                        disabled={isSendingCode}
                        className="cursor-pointer bg-[#23a55a] text-xs font-medium text-white hover:bg-[#1a7f37]"
                    >
                        {isSendingCode ? 'Отправка...' : 'Подтвердить'}
                    </Button>
                ) : (
                    <span className="rounded bg-[#23a55a]/10 px-2 py-1 text-xs font-semibold text-[#23a55a]">
                        Активно
                    </span>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { api } from '@/lib/api/api';
import { getErrorMessage } from '@/lib/errors';

interface ProfileVerificationRowProps {
    isVerified: boolean;
}

export default function ProfileVerificationRow({ isVerified }: ProfileVerificationRowProps) {
    const [isSendingCode, setIsSendingCode] = useState(false);

    const handleResendVerification = async () => {
        setIsSendingCode(true);
        try {
            await api.post('/auth/send-code');
            toast.success('Код подтверждения отправлен на вашу почту!');
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setIsSendingCode(false);
        }
    };

    return (
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
            <div className="min-w-0 space-y-1">
                <span className="block text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                    Верификация почты
                </span>
                <span className="block text-sm font-medium text-[#f2f3f5]">
                    {isVerified ? 'Почта успешно подтверждена' : 'Потребуется подтверждение почты'}
                </span>
            </div>

            {!isVerified ? (
                <Button
                    size="sm"
                    onClick={handleResendVerification}
                    disabled={isSendingCode}
                    className="w-full cursor-pointer bg-[#23a55a] text-xs font-medium text-white hover:bg-[#1a7f37] sm:w-auto"
                >
                    {isSendingCode ? 'Отправка...' : 'Подтвердить'}
                </Button>
            ) : (
                <span className="self-start rounded bg-[#23a55a]/10 px-2 py-1 text-xs font-semibold text-[#23a55a] sm:self-auto">
                    Активно
                </span>
            )}
        </div>
    );
}

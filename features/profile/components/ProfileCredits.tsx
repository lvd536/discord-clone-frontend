'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { api } from '@/lib/api/api';
import { getErrorMessage } from '@/lib/errors';

export default function ProfileCredits() {
    const { profile, refetchUser } = useAuthStore();
    const [isSendingCode, setIsSendingCode] = useState(false);

    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [isSavingUsername, setIsSavingUsername] = useState(false);

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [isSavingEmail, setIsSavingEmail] = useState(false);

    const handleStartEditUsername = () => {
        setNewUsername(profile?.displayName || '');
        setIsEditingUsername(true);
    };

    const handleCancelUsername = () => {
        setIsEditingUsername(false);
        setNewUsername('');
    };

    const handleSaveUsername = async () => {
        const trimmed = newUsername.trim();
        if (!trimmed) {
            toast.error('Имя не может быть пустым');
            return;
        }
        if (trimmed.length < 3) {
            toast.error('Имя должно содержать минимум 3 символа');
            return;
        }
        if (trimmed === profile?.displayName) {
            setIsEditingUsername(false);
            return;
        }

        setIsSavingUsername(true);
        try {
            await api.patch('/users/profile', { displayName: trimmed });
            await refetchUser();
            toast.success('Отображаемое имя успешно обновлено!');
            setIsEditingUsername(false);
        } catch (err) {
            const errMsg = getErrorMessage(err);
            toast.error(errMsg);
        } finally {
            setIsSavingUsername(false);
        }
    };

    const handleStartEditEmail = () => {
        setNewEmail(profile?.email || '');
        setIsEditingEmail(true);
    };

    const handleCancelEmail = () => {
        setIsEditingEmail(false);
        setNewEmail('');
    };

    const handleSaveEmail = async () => {
        const trimmed = newEmail.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!trimmed || !emailRegex.test(trimmed)) {
            toast.error('Введите корректный адрес электронной почты');
            return;
        }
        if (trimmed === profile?.email) {
            setIsEditingEmail(false);
            return;
        }

        setIsSavingEmail(true);
        try {
            await api.patch('/users/profile', { email: trimmed });
            await refetchUser();
            toast.success('Почта успешно обновлена! Потребуется повторная верификация.');
            setIsEditingEmail(false);
        } catch (err) {
            const errMsg = getErrorMessage(err);
            toast.error(errMsg);
        } finally {
            setIsSavingEmail(false);
        }
    };

    const handleResendVerification = async () => {
        setIsSendingCode(true);
        try {
            await api.post('/auth/send-code');
            toast.success('Код подтверждения отправлен на вашу почту!');
        } catch (err) {
            const errMsg = getErrorMessage(err);
            toast.error(errMsg);
        } finally {
            setIsSendingCode(false);
        }
    };

    if (!profile) return null;

    return (
        <div className="mx-2 mt-4 space-y-4 rounded-lg bg-[#2b2d31] p-4 select-none sm:mx-6">
            <div className="flex flex-col justify-between gap-3 border-b border-[#3f4147]/30 pb-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                    <span className="block text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                        Отображаемое имя
                    </span>

                    {isEditingUsername ? (
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveUsername();
                                if (e.key === 'Escape') handleCancelUsername();
                            }}
                            autoFocus
                            disabled={isSavingUsername}
                            placeholder="Введите новое имя..."
                            className="h-8 w-full max-w-sm rounded border border-black/40 bg-[#1e1f22] px-2.5 text-sm font-medium text-[#f2f3f5] transition-colors focus:border-[#5865f2] focus:outline-none"
                        />
                    ) : (
                        <span className="block truncate text-sm font-medium text-[#f2f3f5]">
                            {profile.displayName}
                        </span>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {isEditingUsername && (
                        <Button
                            size="sm"
                            variant="ghost"
                            disabled={isSavingUsername}
                            className="w-full cursor-pointer text-xs font-medium text-[#dbdee1] hover:bg-[#35363c] hover:text-white sm:w-auto"
                            onClick={handleCancelUsername}
                        >
                            Отмена
                        </Button>
                    )}
                    <Button
                        size="sm"
                        disabled={isSavingUsername}
                        className={`w-full cursor-pointer text-xs font-medium text-white transition-colors sm:w-auto ${
                            isEditingUsername
                                ? 'bg-[#23a55a] hover:bg-[#1a7f37]'
                                : 'bg-[#4e5058] hover:bg-[#6d6f78]'
                        }`}
                        onClick={isEditingUsername ? handleSaveUsername : handleStartEditUsername}
                    >
                        {isSavingUsername
                            ? 'Сохранение...'
                            : isEditingUsername
                              ? 'Сохранить'
                              : 'Изменить'}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col justify-between gap-3 border-b border-[#3f4147]/30 pb-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                    <span className="block text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                        Электронная почта
                    </span>

                    {isEditingEmail ? (
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEmail();
                                if (e.key === 'Escape') handleCancelEmail();
                            }}
                            autoFocus
                            disabled={isSavingEmail}
                            placeholder="new-email@example.com"
                            className="h-8 w-full max-w-sm rounded border border-black/40 bg-[#1e1f22] px-2.5 text-sm font-medium text-[#f2f3f5] transition-colors focus:border-[#5865f2] focus:outline-none"
                        />
                    ) : (
                        <span className="block truncate text-sm font-medium text-[#f2f3f5]">
                            {profile.email}
                        </span>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {isEditingEmail && (
                        <Button
                            size="sm"
                            variant="ghost"
                            disabled={isSavingEmail}
                            className="w-full cursor-pointer text-xs font-medium text-[#dbdee1] hover:bg-[#35363c] hover:text-white sm:w-auto"
                            onClick={handleCancelEmail}
                        >
                            Отмена
                        </Button>
                    )}
                    <Button
                        size="sm"
                        disabled={isSavingEmail}
                        className={`w-full cursor-pointer text-xs font-medium text-white transition-colors sm:w-auto ${
                            isEditingEmail
                                ? 'bg-[#23a55a] hover:bg-[#1a7f37]'
                                : 'bg-[#4e5058] hover:bg-[#6d6f78]'
                        }`}
                        onClick={isEditingEmail ? handleSaveEmail : handleStartEditEmail}
                    >
                        {isSavingEmail
                            ? 'Сохранение...'
                            : isEditingEmail
                              ? 'Сохранить'
                              : 'Изменить'}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
                <div className="min-w-0 space-y-1">
                    <span className="block text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                        Верификация почты
                    </span>
                    <span className="block text-sm font-medium text-[#f2f3f5]">
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
        </div>
    );
}

'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { api } from '@/lib/api/api';

export default function ProfilePage() {
    const router = useRouter();
    const { profile, accounts, clearUser } = useAuthStore();
    const [isSendingCode, setIsSendingCode] = useState(false);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
        } finally {
            localStorage.removeItem('access_token');
            if (clearUser) clearUser();
            toast.success('Вы вышли из системы');
            router.push('/auth/login');
        }
    };

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

    if (!profile) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-muted-foreground animate-pulse text-sm">
                    Загрузка профиля...
                </div>
            </div>
        );
    }

    const initials = profile.displayName ? profile.displayName.slice(0, 2).toUpperCase() : 'U';

    return (
        <div className="container mx-auto max-w-4xl px-4 py-10">
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="h-fit md:col-span-1">
                    <CardHeader className="flex flex-col items-center text-center">
                        {profile.avatarUrl ? (
                            <Image
                                src={profile.avatarUrl}
                                alt={profile.displayName}
                                width={1280}
                                height={720}
                                className="border-muted h-24 w-24 rounded-full border-4 object-cover"
                            />
                        ) : (
                            <div className="bg-primary text-primary-foreground border-muted flex h-24 w-24 items-center justify-center rounded-full border-4 text-3xl font-bold">
                                {initials}
                            </div>
                        )}
                        <CardTitle className="mt-4">{profile.displayName}</CardTitle>
                        <CardDescription>{profile.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 pt-0">
                        <Button variant="destructive" onClick={handleLogout} className="w-full">
                            Выйти из аккаунта
                        </Button>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-6 md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Информация о пользователе</CardTitle>
                            <CardDescription>Управление твоими личными настройками</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-card text-card-foreground flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <p className="text-sm font-semibold">Статус аккаунта</p>
                                    <p className="text-muted-foreground text-xs">
                                        {profile.isVerified
                                            ? 'Ваш email успешно подтвержден'
                                            : 'Требуется подтвердить адрес электронной почты'}
                                    </p>
                                </div>
                                <div>
                                    {profile.isVerified ? (
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                            Подтвержден
                                        </span>
                                    ) : (
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                Не подтвержден
                                            </span>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="h-auto p-0 text-xs"
                                                disabled={isSendingCode}
                                                onClick={handleResendVerification}
                                            >
                                                {isSendingCode ? 'Отправка...' : 'Отправить ссылку'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-card text-card-foreground flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <p className="text-sm font-semibold">Роль на платформе</p>
                                    <p className="text-muted-foreground text-xs">
                                        Ваш уровень прав доступа
                                    </p>
                                </div>
                                <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-semibold">
                                    {profile.role}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold">
                                    Связанные профили соцсетей
                                </h3>
                                <div className="grid gap-2">
                                    {accounts && accounts.length > 0 ? (
                                        accounts.map((acc) => (
                                            <div
                                                key={acc.id}
                                                className="flex items-center justify-between rounded-lg border p-3 text-sm"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium capitalize">
                                                        {acc.provider}
                                                    </span>
                                                </div>
                                                <span className="text-muted-foreground text-xs">
                                                    Привязан
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground text-xs italic">
                                            Нет привязанных внешних аккаунтов. Регистрация
                                            производилась через email.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

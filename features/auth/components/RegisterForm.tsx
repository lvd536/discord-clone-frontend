'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useAuthStore } from '@/features/auth/store/auth.store';

import { register } from '../actions';
import { useAuthCookie } from '../hooks/useAuthCookie';
import OAuthProviders from './OAuthProviders';

const registerFormSchema = z.object({
    displayName: z.string().min(4, 'Имя должно быть не менее 4 символов'),
    email: z.email('Некорректный формат почты'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

export function RegisterForm() {
    const router = useRouter();
    const { setAuthToken } = useAuthCookie();
    const initUser = useAuthStore((state) => state.initUser);

    const form = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            displayName: '',
            email: '',
            password: '',
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    async function onSubmit(data: z.infer<typeof registerFormSchema>) {
        try {
            const { user, access_token } = await register(data);

            setAuthToken(access_token);
            await initUser(user);

            toast.success('Регистрация прошла успешно!');
            router.push('/dashboard');
        } catch (err) {
            toast.error((err as Error).message || 'Не удалось зарегистрироваться');
        }
    }

    return (
        <div className="mt-10 w-full max-w-120 rounded-lg border border-[#1f2023]/60 bg-[#313338] p-8 text-white shadow-2xl">
            <div className="mb-6 space-y-1 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                    Создать учетную запись
                </h2>
            </div>

            <OAuthProviders />

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="mb-1.5 flex items-center gap-1 text-[11px] font-bold tracking-wider text-[#b5bac1] uppercase">
                        Отображаемое имя <span className="text-[#f23f43]">*</span>
                    </label>
                    <Controller
                        name="displayName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <>
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="Как к вам обращаться?"
                                    autoComplete="nickname"
                                    className={`h-10 w-full rounded border bg-[#1e1f22] px-3 text-sm text-[#dbdee1] transition-colors focus:outline-none ${
                                        fieldState.invalid
                                            ? 'border-[#f23f43]'
                                            : 'border-black/30 focus:border-[#5865f2]'
                                    }`}
                                />
                                {fieldState.error && (
                                    <span className="mt-1 block text-xs text-[#f23f43]">
                                        {fieldState.error.message}
                                    </span>
                                )}
                            </>
                        )}
                    />
                </div>

                <div>
                    <label className="mb-1.5 flex items-center gap-1 text-[11px] font-bold tracking-wider text-[#b5bac1] uppercase">
                        Адрес электронной почты <span className="text-[#f23f43]">*</span>
                    </label>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <>
                                <input
                                    {...field}
                                    type="email"
                                    placeholder="example@mail.ru"
                                    autoComplete="email"
                                    className={`h-10 w-full rounded border bg-[#1e1f22] px-3 text-sm text-[#dbdee1] transition-colors focus:outline-none ${
                                        fieldState.invalid
                                            ? 'border-[#f23f43]'
                                            : 'border-black/30 focus:border-[#5865f2]'
                                    }`}
                                />
                                {fieldState.error && (
                                    <span className="mt-1 block text-xs text-[#f23f43]">
                                        {fieldState.error.message}
                                    </span>
                                )}
                            </>
                        )}
                    />
                </div>

                <div>
                    <label className="mb-1.5 flex items-center gap-1 text-[11px] font-bold tracking-wider text-[#b5bac1] uppercase">
                        Пароль <span className="text-[#f23f43]">*</span>
                    </label>
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <>
                                <input
                                    {...field}
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className={`h-10 w-full rounded border bg-[#1e1f22] px-3 text-sm text-[#dbdee1] transition-colors focus:outline-none ${
                                        fieldState.invalid
                                            ? 'border-[#f23f43]'
                                            : 'border-black/30 focus:border-[#5865f2]'
                                    }`}
                                />
                                {fieldState.error && (
                                    <span className="mt-1 block text-xs text-[#f23f43]">
                                        {fieldState.error.message}
                                    </span>
                                )}
                            </>
                        )}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center rounded bg-[#5865f2] text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#4752c4] disabled:opacity-50"
                >
                    {isSubmitting ? 'Создание...' : 'Продолжить'}
                </button>

                <div className="pt-2 text-xs text-[#949ba4]">
                    Уже есть учетная запись?
                    <Link href="/auth/login" className="font-medium text-[#00a8fc] hover:underline">
                        Войти
                    </Link>
                </div>
            </form>
        </div>
    );
}

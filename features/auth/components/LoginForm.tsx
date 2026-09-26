'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useAuthStore } from '@/features/auth/store/auth.store';

import { login } from '../actions';
import { useAuthCookie } from '../hooks/useAuthCookie';
import AuthCard from './AuthCard';
import AuthInputField from './AuthInputField';

const loginFormSchema = z.object({
    email: z.email('Некорректный формат почты'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
    const router = useRouter();
    const { setAuthToken } = useAuthCookie();
    const initUser = useAuthStore((state) => state.initUser);

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: '', password: '' },
    });

    async function onSubmit(data: LoginFormValues) {
        try {
            const { user, access_token } = await login(data);
            setAuthToken(access_token);
            await initUser(user);

            toast.success(`С возвращением, ${user.displayName}!`);
            router.push('/dashboard');
        } catch (err) {
            toast.error((err as Error).message || 'Неверная почта или пароль');
        }
    }

    return (
        <AuthCard title="С возвращением!" subtitle="Мы так рады видеть вас снова!">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <AuthInputField
                    label="Адрес электронной почты"
                    type="email"
                    required
                    placeholder="example@mail.ru"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...formRegister('email')}
                />

                <AuthInputField
                    label="Пароль"
                    type="password"
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    error={errors.password?.message}
                    {...formRegister('password')}
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center rounded bg-[#5865f2] text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#4752c4] disabled:opacity-50"
                >
                    {isSubmitting ? 'Вход...' : 'Вход'}
                </button>

                <div className="pt-2 text-xs text-[#949ba4]">
                    Нужна учетная запись?{' '}
                    <Link
                        href="/auth/register"
                        className="font-medium text-[#00a8fc] hover:underline"
                    >
                        Зарегистрироваться
                    </Link>
                </div>
            </form>
        </AuthCard>
    );
}

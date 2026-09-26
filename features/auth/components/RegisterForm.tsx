'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useAuthStore } from '@/features/auth/store/auth.store';

import { register } from '../actions';
import { useAuthCookie } from '../hooks/useAuthCookie';
import AuthCard from './AuthCard';
import AuthInputField from './AuthInputField';

const registerFormSchema = z.object({
    displayName: z.string().min(4, 'Имя должно быть не менее 4 символов'),
    email: z.email('Некорректный формат почты'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
    const router = useRouter();
    const { setAuthToken } = useAuthCookie();
    const initUser = useAuthStore((state) => state.initUser);

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: { displayName: '', email: '', password: '' },
    });

    async function onSubmit(data: RegisterFormValues) {
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
        <AuthCard title="Создать учетную запись">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <AuthInputField
                    label="Отображаемое имя"
                    required
                    placeholder="Как к вам обращаться?"
                    autoComplete="nickname"
                    error={errors.displayName?.message}
                    {...formRegister('displayName')}
                />

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
                    autoComplete="new-password"
                    error={errors.password?.message}
                    {...formRegister('password')}
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center rounded bg-[#5865f2] text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#4752c4] disabled:opacity-50"
                >
                    {isSubmitting ? 'Создание...' : 'Продолжить'}
                </button>

                <div className="pt-2 text-xs text-[#949ba4]">
                    Уже есть учетная запись?{' '}
                    <Link href="/auth/login" className="font-medium text-[#00a8fc] hover:underline">
                        Войти
                    </Link>
                </div>
            </form>
        </AuthCard>
    );
}

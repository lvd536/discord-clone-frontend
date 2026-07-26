'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { useAuthStore } from '@/features/auth/store/auth.store';

import { login } from '../actions';
import { useAuthCookie } from '../hooks/useAuthCookie';
import OAuthProviders from './';

const loginFormSchema = z.object({
    email: z.email('Некорректный формат почты'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

export function LoginForm() {
    const router = useRouter();

    const { setAuthToken } = useAuthCookie();

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const initUser = useAuthStore((state) => state.initUser);

    async function onSubmit(data: z.infer<typeof loginFormSchema>) {
        try {
            const { user, access_token } = await login(data);

            setAuthToken(access_token);

            await initUser(user);

            toast('Вход выполнен успешно!', {
                description: `Рады видеть вас снова, ${user.displayName}!`,
                position: 'bottom-right',
            });

            router.push('/profile');
        } catch (err) {
            toast('Ошибка входа:', {
                description: (err as Error).message,
                position: 'top-center',
            });
        }
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Вход</CardTitle>
            </CardHeader>
            <CardContent>
                <OAuthProviders />
                <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="email">Почта</FieldLabel>
                                    <Input
                                        {...field}
                                        id="email"
                                        type="email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="example@example.com"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="password">Пароль</FieldLabel>
                                    <Input
                                        {...field}
                                        type="password"
                                        id="password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Введите пароль..."
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal" className="flex w-full justify-between">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Сбросить
                    </Button>
                    <Button type="submit" form="login-form">
                        Войти
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    );
}

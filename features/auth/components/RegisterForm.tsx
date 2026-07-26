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

import { register } from '../actions';
import { useAuthCookie } from '../hooks/useAuthCookie';
import OAuthProviders from './';

const registerFormSchema = z.object({
    displayName: z.string().min(4, 'Имя должно быть не менее 4 символов'),
    email: z.email('Некорректный формат почты'),
    password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

export function RegisterForm() {
    const router = useRouter();

    const { setAuthToken } = useAuthCookie();

    const form = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            email: '',
            displayName: '',
            password: '',
        },
    });

    const initUser = useAuthStore((state) => state.initUser);

    async function onSubmit(data: z.infer<typeof registerFormSchema>) {
        try {
            const { user, access_token } = await register(data);

            setAuthToken(access_token);

            await initUser(user);

            toast('Регистрация прошла успешно!', {
                description: `Добро пожаловать, ${user.displayName}! Пожалуйста, проверьте почту для подтверждения.`,
                position: 'bottom-right',
            });

            router.push('/profile');
        } catch (err) {
            toast('Ошибка регистрации:', {
                description: (err as Error).message,
                position: 'top-center',
            });
        }
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Регистрация</CardTitle>
            </CardHeader>
            <CardContent>
                <OAuthProviders />
                <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="displayName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="display-name">Имя</FieldLabel>
                                    <Input
                                        {...field}
                                        id="display-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="John Doe"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
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
                    <Button type="submit" form="register-form">
                        Зарегистрироваться
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    );
}

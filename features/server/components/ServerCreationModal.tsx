'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { createServer } from '../actions';

const serverCreationFormSchema = z.object({
    name: z
        .string('Название должно быть строкой')
        .min(4, 'Минимальная длина названия сервера 4 символа')
        .max(12, 'Название сервера не должно превышать 12 символов'),
    imageUrl: z.string(),
});

export default function ServerCreationModal() {
    const form = useForm<z.infer<typeof serverCreationFormSchema>>({
        resolver: zodResolver(serverCreationFormSchema),
        defaultValues: {
            name: '',
            imageUrl: '',
        },
    });

    async function onSubmit(data: z.infer<typeof serverCreationFormSchema>) {
        try {
            const response = await createServer(data);

            if (!response.success) throw new Error(response.error);

            toast(`Сервер  ${data.name} успешно создан!`, {
                position: 'bottom-right',
            });
        } catch (err) {
            toast('Ошибка создания сервера:', {
                description: (err as Error).message,
                position: 'top-center',
            });
        }
    }

    return (
        <Dialog>
            <form id="server-creation-form" onSubmit={form.handleSubmit(onSubmit)}>
                <DialogTrigger
                    render={
                        <button className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-[24px] bg-[#313338] text-[#23a55a] transition-all duration-200 hover:rounded-[16px] hover:bg-[#23a55a] hover:text-white">
                            <Plus className="h-6 w-6" />
                        </button>
                    }
                />
                <DialogContent className="max-w-xl">
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="name">Название</FieldLabel>
                                    <Input
                                        {...field}
                                        id="name"
                                        type="name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Server 1"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Сбросить
                        </Button>
                        <DialogClose render={<Button variant="outline">Закрыть</Button>} />
                        <Button type="submit" form="server-creation-form">
                            Создать
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}

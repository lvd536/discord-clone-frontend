'use client';

import { ChannelType } from '@backend/types/__generated__/enums';
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { createChannel } from '../actions';

const channelCreationFormSchema = z.object({
    name: z
        .string('Название должно быть строкой')
        .min(2, 'Минимальная длина названия канала 2 символа')
        .max(8, 'Название канала не должно превышать 8 символов'),
    type: z.enum(ChannelType, {
        error: () => ({ message: 'Неверный тип канала' }),
    }),
});

interface IProps {
    serverId: string;
}

export default function CreateChannelModal({ serverId }: IProps) {
    const form = useForm<z.infer<typeof channelCreationFormSchema>>({
        resolver: zodResolver(channelCreationFormSchema),
        defaultValues: {
            name: '',
            type: ChannelType.TEXT,
        },
    });

    async function onSubmit(data: z.infer<typeof channelCreationFormSchema>) {
        try {
            const response = await createChannel(serverId, data.name, data.type);

            if (!response.success) throw new Error(response.error);

            toast(`Канал  ${data.name} успешно создан!`, {
                position: 'bottom-right',
            });
        } catch (err) {
            toast('Ошибка создания канала:', {
                description: (err as Error).message,
                position: 'top-center',
            });
        }
    }

    const channelTypeItems = Object.values(ChannelType).map((type) => ({
        value: type,
        label: type.charAt(0) + type.slice(1).toLowerCase(),
    }));

    return (
        <Dialog>
            <form id="channel-creation-form" onSubmit={form.handleSubmit(onSubmit)}>
                <DialogTrigger
                    render={
                        <button>
                            <Plus size={16} className="focus:outline-0" />
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
                        <Controller
                            name="type"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div
                                    className="flex flex-col gap-1.5"
                                    data-invalid={fieldState.invalid}
                                >
                                    <label htmlFor="type" className="text-sm font-medium">
                                        Тип канала
                                    </label>

                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger id="type" className="w-45">
                                            <SelectValue placeholder="Выберите тип" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {channelTypeItems.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && fieldState.error && (
                                        <p className="text-destructive text-sm font-medium">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </FieldGroup>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Сбросить
                        </Button>
                        <DialogClose render={<Button variant="outline">Закрыть</Button>} />
                        <Button type="submit" form="channel-creation-form">
                            Создать
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}

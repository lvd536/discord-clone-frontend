import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { editServer } from '../actions';

interface IProps {
    serverName: string;
    serverAvatar?: string;
    serverId: string;
    open: boolean;
    onOpenChange: () => void;
}

const serverEditFormSchema = z.object({
    name: z
        .string('Название должно быть строкой')
        .min(4, 'Минимальная длина названия сервера 4 символа')
        .max(12, 'Название сервера не должно превышать 12 символов'),
    imageUrl: z.string().optional(),
});

export default function ServerEditModal({
    serverName,
    serverAvatar,
    serverId,
    open,
    onOpenChange,
}: IProps) {
    const form = useForm<z.infer<typeof serverEditFormSchema>>({
        resolver: zodResolver(serverEditFormSchema),
        defaultValues: {
            name: serverName,
            imageUrl: serverAvatar,
        },
    });

    async function onSubmit(data: z.infer<typeof serverEditFormSchema>) {
        try {
            await editServer(data, serverId);

            toast(`Сервер  ${data.name} изменен!`, {
                position: 'bottom-right',
            });
        } catch (err) {
            toast('Ошибка обновления сервера:', {
                description: (err as Error).message,
                position: 'top-center',
            });
        } finally {
            onOpenChange();
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <form id="server-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                    <DialogFooter className="mt-2">
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Сбросить
                        </Button>
                        <DialogClose render={<Button variant="outline">Закрыть</Button>} />
                        <Button type="submit" form="server-edit-form">
                            Изменить
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

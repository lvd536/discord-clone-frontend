'use client';

import { useState } from 'react';

import { Role } from '@backend/types/__generated__/client';
import { RolePermissions } from '@backend/types/__generated__/enums';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';

import { updateServerRole } from '../actions';
import { PRESET_COLORS } from '../constants/role.constants';

const editRoleFormSchema = z.object({
    name: z.string().min(2, 'Минимум 2 символа'),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Неверный формат цвета'),
    permissions: z.array(z.enum(RolePermissions)),
});

type EditRoleFormValues = z.infer<typeof editRoleFormSchema>;

interface IProps {
    role: Role;
}

export default function RoleEditModal({ role }: IProps) {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<EditRoleFormValues>({
        resolver: zodResolver(editRoleFormSchema),
        defaultValues: {
            name: role.name,
            color: role.color || '#99aab5',
            permissions: role.permissions || [],
        },
    });

    const onSubmit = async (values: EditRoleFormValues) => {
        try {
            const response = await updateServerRole({
                serverId: role.serverId,
                role: values,
                roleId: role.id,
            });

            if (response.success) {
                toast.success('Роль успешно обновлена');
                setIsOpen(false);
            } else throw new Error(response.error);
        } catch (err) {
            if (err instanceof Error) {
                toast.error('Ошибка при изменении роли', {
                    description: err.message,
                });
            } else toast.error('Не удалось обновить роль');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
                render={
                    <button className="z-999 flex h-8 w-8 items-center justify-center rounded text-[#b5bac1] transition-colors hover:bg-[#35373c] hover:text-[#dbdee1]">
                        <Pencil size={18} />
                    </button>
                }
            />

            <DialogContent className="z-9999 max-w-lg overflow-hidden rounded-md border-none bg-[#313338] p-0 text-[#dbdee1] outline-none">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    id="role-edit-form"
                    className="z-9999 space-y-5 p-4"
                >
                    <DialogHeader className="p-4 pb-2">
                        <DialogTitle className="text-xl font-bold text-white">
                            Редактирование роли
                        </DialogTitle>
                    </DialogHeader>

                    <Field>
                        <FieldLabel htmlFor="name">Название роли</FieldLabel>
                        <Input
                            id="name"
                            {...form.register('name')}
                            className="border-none bg-[#1e1f22] text-white focus-visible:ring-1 focus-visible:ring-[#5865f2]"
                        />
                    </Field>

                    <Controller
                        name="color"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="color">Цвет роли</FieldLabel>

                                <div className="rounded-md bg-[#2b2d31] p-2.5 sm:p-3">
                                    <div className="flex flex-row items-center gap-3 sm:grid sm:grid-cols-2 sm:items-start sm:gap-4">
                                        <div className="custom-color-picker shrink-0">
                                            <HexColorPicker
                                                color={field.value}
                                                onChange={field.onChange}
                                            />
                                        </div>

                                        <div className="flex h-full min-w-0 flex-1 flex-col justify-between py-0.5 sm:gap-3">
                                            <div>
                                                <span className="mb-1 block text-[11px] text-[#b5bac1] sm:text-xs">
                                                    HEX-код
                                                </span>
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <div
                                                        className="h-7 w-7 shrink-0 rounded border border-[#1e1f22] sm:h-8 sm:w-8"
                                                        style={{ backgroundColor: field.value }}
                                                    />
                                                    <Input
                                                        maxLength={7}
                                                        onChange={(e) =>
                                                            field.onChange(e.target.value)
                                                        }
                                                        value={field.value}
                                                        className="h-7 w-full border-none bg-[#1e1f22] px-2 text-[11px] text-white uppercase sm:h-8 sm:text-xs"
                                                    />
                                                </div>
                                            </div>

                                            <div className="hidden sm:block">
                                                <span className="mb-1.5 block text-xs text-[#b5bac1]">
                                                    Популярные цвета
                                                </span>
                                                <div className="grid grid-cols-5 gap-1.5">
                                                    {PRESET_COLORS.map((color) => (
                                                        <button
                                                            key={color}
                                                            type="button"
                                                            onClick={() => field.onChange(color)}
                                                            className="h-6 w-6 rounded-full transition-transform hover:scale-110 focus:outline-none active:scale-95"
                                                            style={{ backgroundColor: color }}
                                                            title={color}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="permissions"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <MultiSelect
                                    onChange={field.onChange}
                                    selected={field.value}
                                    options={Object.values(RolePermissions).map((permission) => ({
                                        label: permission,
                                        value: permission,
                                    }))}
                                />
                            </Field>
                        )}
                    />

                    <DialogFooter className="flex flex-row! items-center justify-end gap-3 rounded-md bg-[#2b2d31] p-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            disabled={!form.formState.isDirty}
                            className="h-auto bg-transparent p-0 text-sm font-medium text-white hover:bg-transparent hover:underline disabled:opacity-40"
                        >
                            Сбросить
                        </Button>

                        <DialogClose
                            render={
                                <Button
                                    type="button"
                                    className="h-9 bg-transparent px-4 text-sm font-medium text-white hover:underline"
                                >
                                    Отмена
                                </Button>
                            }
                        />

                        <Button
                            type="submit"
                            form="role-edit-form"
                            disabled={!form.formState.isDirty || form.formState.isSubmitting}
                            className="h-9 rounded bg-[#5865f2] px-5 text-sm font-medium text-white transition-colors hover:bg-[#4752c4] disabled:opacity-50"
                        >
                            Сохранить
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

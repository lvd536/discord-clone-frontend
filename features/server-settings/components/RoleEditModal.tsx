'use client';

import { useState } from 'react';

import { Role } from '@backend/types/__generated__/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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

import { getErrorMessage } from '@/lib/errors';

import { updateServerRole } from '../actions';
import RoleFormFields, { RoleFormValues, roleFormSchema } from './RoleFormFields';

interface IProps {
    role: Role;
}

export default function RoleEditModal({ role }: IProps) {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            name: role.name,
            color: role.color || '#99aab5',
            permissions: role.permissions || [],
        },
    });

    const onSubmit = async (values: RoleFormValues) => {
        try {
            const res = await updateServerRole({
                serverId: role.serverId,
                role: values,
                roleId: role.id,
            });
            if (res.success) {
                toast.success('Роль успешно обновлена');
                setIsOpen(false);
            } else throw new Error(res.error);
        } catch (err) {
            const message = getErrorMessage(err);
            toast.error(message);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
                render={
                    <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-[#b5bac1] transition-colors hover:bg-[#35363c] hover:text-[#dbdee1]">
                        <Pencil size={18} />
                    </button>
                }
            />

            <DialogContent className="z-9999 max-w-lg rounded-md border-none bg-[#313338] p-0 text-[#dbdee1] outline-none">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
                    <DialogHeader className="p-4 pb-2">
                        <DialogTitle className="text-xl font-bold text-white">
                            Редактирование роли
                        </DialogTitle>
                    </DialogHeader>

                    <RoleFormFields register={form.register} control={form.control} />

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
                            disabled={!form.formState.isDirty || form.formState.isSubmitting}
                            className="h-9 rounded bg-[#5865f2] px-5 text-sm font-medium text-white transition-colors hover:bg-[#4752c4] disabled:opacity-50"
                        >
                            {form.formState.isSubmitting ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

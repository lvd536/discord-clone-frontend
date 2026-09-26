'use client';

import { useState } from 'react';

import { Role } from '@backend/types/__generated__/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
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

import { ServerMemberType } from '@/features/shared/types/channel.types';
import { getErrorMessage } from '@/lib/errors';

import { grantMemberRoles, kickMember } from '../actions';
import MemberKickCard from './MemberKickCard';
import MemberRolesSelector from './MemberRolesSelector';

interface IProps {
    member: ServerMemberType;
    roles: Role[];
}

const editMemberFormSchema = z.object({
    roles: z.array(z.string()),
});

type EditMemberFormValues = z.infer<typeof editMemberFormSchema>;

export default function MemberEditModal({ member, roles }: IProps) {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<EditMemberFormValues>({
        resolver: zodResolver(editMemberFormSchema),
        defaultValues: {
            roles: member.roles?.map((r) => r.id) || [],
        },
    });

    const selectedRoles = form.watch('roles');

    const toggleRole = (roleId: string) => {
        const current = form.getValues('roles');
        const next = current.includes(roleId)
            ? current.filter((id) => id !== roleId)
            : [...current, roleId];
        form.setValue('roles', next, { shouldDirty: true });
    };

    const onSubmit = async (values: EditMemberFormValues) => {
        try {
            const res = await grantMemberRoles({
                memberId: member.id,
                serverId: member.serverId,
                roleIds: values.roles,
            });

            if (res.success) {
                toast.success('Роли пользователя успешно обновлены');
                setIsOpen(false);
            } else throw new Error(res.error);
        } catch (err) {
            const message = getErrorMessage(err);
            toast.error(message);
        }
    };

    const handleKickMember = async () => {
        try {
            const res = await kickMember({ memberId: member.id, serverId: member.serverId });
            if (res.success) {
                toast.success(`Пользователь ${member.user.displayName} исключен с сервера`);
                setIsOpen(false);
            } else throw new Error(res.error);
        } catch (err) {
            const message = getErrorMessage(err);
            toast.error(message);
        }
    };

    const isTargetOwner = member.roles.some((r) => r.permissions.includes('OWNER'));

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
                render={
                    <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-[#b5bac1] transition-colors hover:bg-[#35363c] hover:text-[#dbdee1]">
                        <Pencil size={18} />
                    </button>
                }
            />

            <DialogContent className="z-999 max-w-110 overflow-hidden rounded-md border-none bg-[#313338] p-0 text-[#dbdee1] outline-none">
                <DialogHeader className="p-4 pb-2">
                    <DialogTitle className="text-xl font-bold text-white">
                        Управление пользователем
                    </DialogTitle>
                    <p className="mt-1 text-sm text-[#b5bac1]">
                        Изменение ролей для{' '}
                        <span className="font-semibold text-white">{member.user.displayName}</span>
                    </p>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-4">
                    <MemberRolesSelector
                        roles={roles}
                        selectedRoles={selectedRoles}
                        onToggleRole={toggleRole}
                    />

                    <div className="h-px bg-[#3f4147]" />

                    {!isTargetOwner && <MemberKickCard onKick={handleKickMember} />}

                    <DialogFooter className="flex items-center justify-end gap-3 bg-[#2b2d31] p-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            disabled={!form.formState.isDirty}
                            className="h-auto bg-transparent p-0 text-sm font-medium text-white hover:underline disabled:opacity-40"
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
                            Сохранить
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

'use client';

import { useState } from 'react';

import { Role } from '@backend/types/__generated__/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, ShieldAlert } from 'lucide-react';
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

import { grantMemberRoles, kickMember } from '../actions';

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

    const currentRoleIds = member.roles?.map((r) => r.id) || [];

    const form = useForm<EditMemberFormValues>({
        resolver: zodResolver(editMemberFormSchema),
        defaultValues: {
            roles: currentRoleIds,
        },
    });

    const selectedRoles = form.watch('roles');

    const toggleRole = (roleId: string) => {
        const current = form.getValues('roles');
        if (current.includes(roleId)) {
            form.setValue(
                'roles',
                current.filter((id) => id !== roleId),
                { shouldDirty: true },
            );
        } else {
            form.setValue('roles', [...current, roleId], { shouldDirty: true });
        }
    };

    const onSubmit = async (values: EditMemberFormValues) => {
        try {
            const response = await grantMemberRoles({
                memberId: member.id,
                serverId: member.serverId,
                roleIds: values.roles,
            });

            if (response.success) {
                toast.success('Роли пользователя успешно обновлены');
                setIsOpen(false);
            } else throw new Error(response.error);
        } catch (err) {
            if (err instanceof Error) {
                toast.error('Ошибка при обновлении ролей пользователя', {
                    description: err.message,
                });
            } else toast.error('Не удалось обновить роли');
        }
    };

    const handleKickMember = async () => {
        try {
            const response = await kickMember({ memberId: member.id, serverId: member.serverId });

            if (response.success) {
                toast.success(`Пользователь ${member.user.displayName} успешно удален с сервера`);
                setIsOpen(false);
            }
        } catch (err) {
            if (err instanceof Error) {
                toast.error(`Ошибка при кике пользователя: ${err.message}`);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
                render={
                    <button className="flex h-8 w-8 items-center justify-center rounded text-[#b5bac1] transition-colors hover:bg-[#35373c] hover:text-[#dbdee1]">
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
                        Изменение ролей и прав для{' '}
                        <span className="font-semibold text-white">{member.user.displayName}</span>
                    </p>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    id="member-edit-form"
                    className="space-y-5 p-4"
                >
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-[#semibold] uppercase">
                            Роли ({selectedRoles.length})
                        </label>

                        <div className="custom-scrollbar mt-2 max-h-45 space-y-1 overflow-y-auto rounded border border-[#1f2023] bg-[#1e1f22] p-2">
                            {roles.map((role) => {
                                const isChecked = selectedRoles.includes(role.id);
                                return (
                                    <div
                                        key={role.id}
                                        role="checkbox"
                                        aria-checked={isChecked}
                                        tabIndex={0}
                                        onClick={() => toggleRole(role.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                toggleRole(role.id);
                                            }
                                        }}
                                        className="flex w-full cursor-pointer items-center justify-between rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-[#35373c] focus:bg-[#35373c] focus:outline-none"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 shrink-0 rounded-full"
                                                style={{ backgroundColor: role.color || '#fff' }}
                                            />
                                            <span
                                                style={{ color: role.color || '#fff' }}
                                                className="font-medium"
                                            >
                                                {role.name}
                                            </span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => {}}
                                            className="pointer-events-none h-4 w-4 rounded border-[#4e5058] bg-[#313338] text-[#5865f2] accent-[#5865f2] focus:ring-0 focus:ring-offset-0"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="h-px bg-[#3f4147]" />

                    {!roles.some((r) => r.permissions.some((p) => p === 'OWNER')) && (
                        <div className="flex items-center justify-between rounded border border-[#da373c]/30 bg-[#da373c]/10 p-3">
                            <div className="flex items-start gap-2.5">
                                <ShieldAlert className="mt-0.5 shrink-0 text-[#da373c]" size={18} />
                                <div>
                                    <h4 className="text-sm font-semibold text-white">
                                        Исключить пользователя
                                    </h4>
                                    <p className="text-xs text-[#b5bac1]">
                                        Пользователь сможет вернуться по новой ссылке.
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleKickMember}
                                className="h-8 rounded bg-[#da373c] px-3 text-xs font-medium text-white transition-colors hover:bg-[#a92b2f]"
                            >
                                Кикнуть
                            </Button>
                        </div>
                    )}
                </form>

                <DialogFooter className="flex items-center justify-end gap-3 bg-[#2b2d31] p-4">
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
                        form="member-edit-form"
                        disabled={!form.formState.isDirty || form.formState.isSubmitting}
                        className="h-9 rounded bg-[#5865f2] px-5 text-sm font-medium text-white transition-colors hover:bg-[#4752c4] disabled:opacity-50"
                    >
                        Сохранить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

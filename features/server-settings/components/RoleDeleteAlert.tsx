'use client';

import { useState } from 'react';

import { Trash } from 'lucide-react';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { deleteServerRole } from '../actions';

interface IProps {
    roleName: string;
    serverId: string;
    roleId: string;
}

export default function RoleDeleteAlert({ roleName, roleId, serverId }: IProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleDeleteRole = async () => {
        try {
            const response = await deleteServerRole({ serverId, roleId });

            if (response.success) toast.success('Роль успешно удалена');
            else throw new Error(response.error);
        } catch (err) {
            if (err instanceof Error) {
                toast.error('Ошибка при удалении роли', { description: err.message });
            } else {
                toast.error('Произошла непредвиденная ошибка при удалении роли');
            }
        } finally {
            setIsOpen(false);
        }
    };
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger
                render={
                    <button className="z-999 flex h-8 w-8 items-center justify-center rounded text-[#b5bac1] transition-colors hover:bg-[#35373c] hover:text-[#dbdee1]">
                        <Trash size={18} />
                    </button>
                }
            />
            <AlertDialogContent className="z-9999">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Вы уверены что хотите удалить роль {roleName}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Это действие не может быть отменено. Все роли удаляются полностью и
                        безвозвратно
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteRole}>Подтвердить</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

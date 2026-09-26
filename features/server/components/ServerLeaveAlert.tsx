'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

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
} from '@/components/ui/alert-dialog';

import { ROUTES } from '@/features/shared/constants/route.constants';
import { getErrorMessage } from '@/lib/errors';

import { leaveServer } from '../actions';

interface ServerLeaveAlertProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    serverId: string;
    serverName: string;
}

export default function ServerLeaveAlert({
    open,
    onOpenChange,
    serverId,
    serverName,
}: ServerLeaveAlertProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLeave = async () => {
        setIsLoading(true);
        try {
            const res = await leaveServer(serverId);
            if (res.success) {
                toast.success(`Вы покинули сервер ${serverName}`);
                onOpenChange(false);
                router.refresh();
                router.push(ROUTES.DASHBOARD.BASE || '/dashboard');
            } else {
                throw new Error(res.error);
            }
        } catch (err) {
            const message = getErrorMessage(err);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="border-none bg-[#313338] text-white sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">
                        Покинуть &apos;{serverName}&apos;
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-[#949ba4]">
                        Вы уверены, что хотите покинуть сервер{' '}
                        <span className="font-semibold text-white">{serverName}</span>? Вы не
                        сможете вернуться обратно, пока не получите новое приглашение.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="-mx-6 -mb-6 gap-2 rounded-b-lg bg-[#2b2d31] p-3">
                    <AlertDialogCancel
                        disabled={isLoading}
                        className="cursor-pointer border-none bg-transparent text-white hover:bg-[#35363c]"
                    >
                        Отмена
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isLoading}
                        onClick={handleLeave}
                        className="cursor-pointer bg-[#da373c] text-white hover:bg-[#a82a2f]"
                    >
                        {isLoading ? 'Выход...' : 'Покинуть сервер'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

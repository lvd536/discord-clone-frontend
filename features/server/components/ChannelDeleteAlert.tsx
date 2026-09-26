'use client';

import { useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

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

import { deleteChannel } from '@/features/shared/actions';
import { ROUTES } from '@/features/shared/constants/route.constants';
import { getErrorMessage } from '@/lib/errors';

interface ChannelDeleteAlertProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    serverId: string;
    channelId: string;
    channelName: string;
}

export default function ChannelDeleteAlert({
    open,
    onOpenChange,
    serverId,
    channelId,
    channelName,
}: ChannelDeleteAlertProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const res = await deleteChannel({ serverId, channelId });

            if (res.success) {
                toast.success(`Канал #${channelName} успешно удален`);
                onOpenChange(false);

                const channelUrl = ROUTES.DASHBOARD.SERVER.CHANNEL(serverId, channelId);
                if (pathname === channelUrl) {
                    router.push(ROUTES.DASHBOARD.SERVER.ID(serverId));
                }

                router.refresh();
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
                    <AlertDialogTitle className="text-xl font-bold">Удалить канал</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-[#949ba4]">
                        Вы уверены, что хотите удалить канал{' '}
                        <span className="font-semibold text-white">#{channelName}</span>? Все
                        сообщения в этом канале будут стерты безвозвратно.
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
                        onClick={handleDelete}
                        className="cursor-pointer bg-[#da373c] text-white hover:bg-[#a82a2f]"
                    >
                        {isLoading ? 'Удаление...' : 'Удалить канал'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

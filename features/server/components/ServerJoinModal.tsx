'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Compass } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { ROUTES } from '@/features/shared/constants/route.constants';

import { joinServer } from '../actions';
import { getErrorMessage } from '@/lib/errors';

export default function ServerJoinModal() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteCode.trim() || loading) return;

        setLoading(true);
        try {
            const response = await joinServer(inviteCode);

            if (!response.success) {
                throw new Error(response.error);
            }

            const member = response.data;

            toast.success('Вы успешно присоединились к серверу!');
            setOpen(false);
            setInviteCode('');

            router.refresh();

            router.push(ROUTES.DASHBOARD.SERVER.ID(member.serverId));
        } catch (err) {
            const message = getErrorMessage(err)
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <button
                        className="group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-[24px] bg-[#313338] text-[#23a55a] transition-all duration-200 hover:rounded-[16px] hover:bg-[#23a55a] hover:text-white"
                        title="Присоединиться к серверу"
                    >
                        <Compass className="h-6 w-6" />
                    </button>
                }
            />

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-white">
                        Присоединиться к серверу
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm text-[#949ba4]">
                        Введите приглашение ниже, чтобы присоединиться к существующему серверу.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleJoin} className="space-y-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="invite-code"
                            className="text-xs font-bold text-[#dbdee1] uppercase"
                        >
                            Код приглашения
                        </label>
                        <Input
                            id="invite-code"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            placeholder="xxxx-xxxx-xxxx-xxxx"
                            className="mt-1 border-none bg-[#1e1f22] text-[#dbdee1] placeholder:text-[#4e5058] focus-visible:ring-0 focus-visible:ring-offset-0"
                            autoComplete="off"
                            disabled={loading}
                        />
                        <span className="mt-1 block text-[11px] text-[#949ba4]">
                            Приглашения обычно выглядят как строка случайных символов:
                            <span className="mt-0.5 ml-1 block font-mono text-[#dbdee1]">
                                xxxx-xxxx-xxxx-xxxx
                            </span>
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="text-white hover:bg-transparent hover:underline"
                            disabled={loading}
                        >
                            Назад
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !inviteCode.trim()}
                            className="bg-[#5865f2] px-6 font-semibold text-white hover:bg-[#4752c4]"
                        >
                            {loading ? 'Присоединение...' : 'Присоединиться'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

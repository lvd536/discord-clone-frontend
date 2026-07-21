'use client';

import { useState } from 'react';

import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface IProps {
    inviteCode: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ServerInviteCodeDialog({ inviteCode, open, onOpenChange }: IProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!inviteCode) return;
        try {
            await navigator.clipboard.writeText(inviteCode);
            setCopied(true);
            toast.success('Код скопирован в буфер обмена');

            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Непредвиденная ошибка';
            toast.error('Не удалось скопировать код', { description: message });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-none sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-white">
                        Приглашение на сервер
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm text-[#949ba4]">
                        Скопируйте код приглашения или присоединяйтесь прямо сейчас!
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <label
                        htmlFor="invite-code"
                        className="text-xs font-bold text-[#dbdee1] uppercase"
                    >
                        Код приглашения
                    </label>

                    <div className="mt-2 flex items-center gap-2 rounded-md border border-none bg-[#1e1f22] p-1">
                        <span className="flex-1 overflow-x-auto px-2 font-medium text-[#dbdee1] select-all max-md:text-xs">
                            {inviteCode}
                        </span>
                        <Button
                            type="button"
                            onClick={handleCopy}
                            className={`h-9 rounded px-4 font-semibold text-white transition-all duration-300 ${
                                copied
                                    ? 'bg-[#23a55a] hover:bg-[#23a55a]'
                                    : 'bg-[#5865f2] hover:bg-[#4752c4]'
                            }`}
                        >
                            <div className="flex min-w-22.5 items-center justify-center gap-2">
                                {copied ? (
                                    <>
                                        <Check className="animate-in fade-in zoom-in h-4 w-4 duration-200" />
                                        <span className="animate-in fade-in duration-200">
                                            Скопировано
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4" />
                                        <span>Копировать</span>
                                    </>
                                )}
                            </div>
                        </Button>
                    </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-4 border-t border-[#3f4147] pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-white transition-colors hover:bg-[#4e5058]/40 hover:text-white"
                    >
                        Отмена
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

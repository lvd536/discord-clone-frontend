'use client';

import { ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface MemberKickCardProps {
    onKick: () => void;
}

export default function MemberKickCard({ onKick }: MemberKickCardProps) {
    return (
        <div className="flex items-center justify-between rounded border border-[#da373c]/30 bg-[#da373c]/10 p-3 select-none">
            <div className="flex items-start gap-2.5">
                <ShieldAlert className="mt-0.5 shrink-0 text-[#da373c]" size={18} />
                <div>
                    <h4 className="text-sm font-semibold text-white">Исключить пользователя</h4>
                    <p className="text-xs text-[#b5bac1]">
                        Пользователь сможет вернуться по новой ссылке-приглашению.
                    </p>
                </div>
            </div>
            <Button
                type="button"
                variant="destructive"
                onClick={onKick}
                className="h-8 cursor-pointer rounded bg-[#da373c] px-3 text-xs font-medium text-white transition-colors hover:bg-[#a92b2f]"
            >
                Кикнуть
            </Button>
        </div>
    );
}

'use client';

import { Role } from '@backend/types/__generated__/client';
import { Check, Copy } from 'lucide-react';

interface UserPopoverBodyProps {
    userId: string;
    displayName: string;
    roles: Role[];
    copied: boolean;
    onCopyId: (e: React.MouseEvent) => void;
}

export default function UserPopoverBody({
    userId,
    displayName,
    roles,
    copied,
    onCopyId,
}: UserPopoverBodyProps) {
    return (
        <div className="space-y-4 bg-[#111214] p-4 pt-6">
            <div className="space-y-3 rounded-xl border border-[#2b2d31]/50 bg-[#1e1f22] p-3.5">
                <div>
                    <h3 className="text-base leading-tight font-bold text-[#f2f3f5]">
                        {displayName}
                    </h3>

                    <button
                        type="button"
                        onClick={onCopyId}
                        className="group/copy mt-1.5 flex cursor-pointer items-center gap-1.5 rounded bg-[#111214] px-2 py-1 font-mono text-[11px] text-[#949ba4] transition-colors hover:bg-[#2b2d31] hover:text-[#dbdee1]"
                        title="Нажмите, чтобы скопировать ID участника"
                    >
                        <span className="max-w-47.5 truncate">ID: {userId}</span>
                        {copied ? (
                            <Check className="h-3 w-3 shrink-0 text-[#23a55a]" />
                        ) : (
                            <Copy className="h-3 w-3 shrink-0 opacity-60 group-hover/copy:opacity-100" />
                        )}
                    </button>
                </div>

                <div className="h-px w-full bg-[#2b2d31]" />

                <div>
                    <h4 className="mb-2 text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                        Роли ({roles?.length ?? 0})
                    </h4>

                    <div className="discord-scroll flex max-h-24 flex-wrap gap-1.5 overflow-y-auto pr-1">
                        {roles && roles.length > 0 ? (
                            roles.map((role) => (
                                <div
                                    key={role.id}
                                    className="flex max-w-full items-center gap-1.5 rounded bg-[#2b2d31] px-2 py-1 text-[11px] font-medium"
                                >
                                    <span
                                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                                        style={{ backgroundColor: role.color }}
                                    />
                                    <span className="truncate text-[#dbdee1]">{role.name}</span>
                                </div>
                            ))
                        ) : (
                            <span className="text-xs text-[#949ba4] italic">Нет ролей</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

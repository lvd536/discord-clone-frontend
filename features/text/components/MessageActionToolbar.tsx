'use client';

import { Pencil, Trash2 } from 'lucide-react';

interface MessageActionToolbarProps {
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function MessageActionToolbar({ onEdit, onDelete }: MessageActionToolbarProps) {
    if (!onEdit && !onDelete) return null;

    return (
        <div className="absolute -top-3.5 right-4 z-10 flex items-center rounded border border-[#232428] bg-[#313338] opacity-0 shadow-sm transition-all duration-150 select-none group-hover:opacity-100">
            {onEdit && (
                <button
                    type="button"
                    onClick={onEdit}
                    className="cursor-pointer rounded-l p-1.5 text-[#b5bac1] transition-colors hover:bg-[#35363c] hover:text-[#dbdee1]"
                    title="Редактировать"
                >
                    <Pencil className="h-3.5 w-3.5" />
                </button>
            )}
            {onDelete && (
                <button
                    type="button"
                    onClick={onDelete}
                    className="cursor-pointer rounded-r p-1.5 text-[#b5bac1] transition-colors hover:bg-[#f23f43] hover:text-white"
                    title="Удалить"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}

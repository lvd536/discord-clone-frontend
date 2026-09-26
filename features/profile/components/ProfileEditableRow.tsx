'use client';

import { Button } from '@/components/ui/button';

interface ProfileEditableRowProps {
    label: string;
    displayValue: string;
    type?: 'text' | 'email';
    placeholder?: string;
    isEditing: boolean;
    editValue: string;
    isSaving: boolean;
    onChange: (val: string) => void;
    onStartEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
}

export default function ProfileEditableRow({
    label,
    displayValue,
    type = 'text',
    placeholder,
    isEditing,
    editValue,
    isSaving,
    onChange,
    onStartEdit,
    onCancel,
    onSave,
}: ProfileEditableRowProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSave();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="flex flex-col justify-between gap-3 border-b border-[#3f4147]/30 pb-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0 flex-1 space-y-1">
                <span className="block text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                    {label}
                </span>

                {isEditing ? (
                    <input
                        type={type}
                        value={editValue}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        disabled={isSaving}
                        placeholder={placeholder}
                        className="h-8 w-full max-w-sm rounded border border-black/40 bg-[#1e1f22] px-2.5 text-sm font-medium text-[#f2f3f5] transition-colors focus:border-[#5865f2] focus:outline-none"
                    />
                ) : (
                    <span className="block truncate text-sm font-medium text-[#f2f3f5]">
                        {displayValue}
                    </span>
                )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
                {isEditing && (
                    <Button
                        size="sm"
                        variant="ghost"
                        disabled={isSaving}
                        className="w-full cursor-pointer text-xs font-medium text-[#dbdee1] hover:bg-[#35363c] hover:text-white sm:w-auto"
                        onClick={onCancel}
                    >
                        Отмена
                    </Button>
                )}
                <Button
                    size="sm"
                    disabled={isSaving}
                    className={`w-full cursor-pointer text-xs font-medium text-white transition-colors sm:w-auto ${
                        isEditing
                            ? 'bg-[#23a55a] hover:bg-[#1a7f37]'
                            : 'bg-[#4e5058] hover:bg-[#6d6f78]'
                    }`}
                    onClick={isEditing ? onSave : onStartEdit}
                >
                    {isSaving ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Изменить'}
                </Button>
            </div>
        </div>
    );
}

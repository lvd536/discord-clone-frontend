'use client';

import { useEffect, useRef } from 'react';

interface MessageInlineEditorProps {
    value: string;
    onChange: (val: string) => void;
    onSave: () => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

export default function MessageInlineEditor({
    value,
    onChange,
    onSave,
    onCancel,
    isSubmitting,
}: MessageInlineEditorProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSave();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="mt-1 flex w-full flex-col gap-1">
            <input
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
                className="w-full rounded border border-[#232428] bg-[#383a40] px-3 py-1.5 text-sm text-[#dbdee1] focus:border-[#5865f2] focus:outline-none"
            />
            <span className="text-[10px] text-[#949ba4]">
                escape для
                <button
                    type="button"
                    onClick={onCancel}
                    className="cursor-pointer text-[#5865f2] hover:underline"
                >
                    отмены
                </button>
                • enter для
                <button
                    type="button"
                    onClick={onSave}
                    className="cursor-pointer text-[#5865f2] hover:underline"
                >
                    сохранения
                </button>
            </span>
        </div>
    );
}

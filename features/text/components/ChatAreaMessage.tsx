'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { INormalizedMessage } from '../types/message.types';

interface IProps {
    message: INormalizedMessage;
    currentUserId?: string;
    onEdit?: (messageId: string, newContent: string) => Promise<void>;
    onDelete?: (messageId: string) => Promise<void>;
    chatEndRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ChatAreaMessage({
    message,
    currentUserId,
    onEdit,
    onDelete,
    chatEndRef,
}: IProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(message.content);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const isAuthor = Boolean(currentUserId && message.senderId === currentUserId);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleSaveEdit = async () => {
        const trimmed = editedContent.trim();

        if (!trimmed || trimmed === message.content) {
            setIsEditing(false);
            setEditedContent(message.content);
            return;
        }

        if (!onEdit) return;

        setIsSubmitting(true);
        try {
            await onEdit(message.id, trimmed);
            setIsEditing(false);
        } catch (err) {
            if (err instanceof Error)
                toast.error(err.message || 'Не удалось отредактировать сообщение');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditedContent(message.content);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        try {
            await onDelete(message.id);
            toast.success('Сообщение удалено');
        } catch (err) {
            if (err instanceof Error) toast.error(err.message || 'Не удалось удалить сообщение');
        }
    };

    const timeString = new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
    const initials = message.senderName.substring(0, 2).toUpperCase();

    return (
        <div className="group relative flex items-start gap-4 rounded px-2 py-1.5 transition-all hover:bg-[#2e3035]/30">
            {isAuthor && !isEditing && (onEdit || onDelete) && (
                <div className="absolute -top-3.5 right-4 z-10 flex items-center rounded border border-[#232428] bg-[#313338] opacity-0 shadow-sm transition-all duration-150 group-hover:opacity-100">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="cursor-pointer rounded-l p-1.5 text-[#b5bac1] transition-colors hover:bg-[#35373c] hover:text-[#dbdee1]"
                            title="Редактировать"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="cursor-pointer rounded-r p-1.5 text-[#b5bac1] transition-colors hover:bg-[#f23f43] hover:text-white"
                            title="Удалить"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            )}

            {message.avatarUrl ? (
                <Image
                    src={message.avatarUrl}
                    alt={message.senderName}
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
            ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5865f2] text-xs font-bold text-white">
                    {initials}
                </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <div className="flex items-center gap-2">
                    <span className="cursor-pointer text-sm font-semibold text-[#f2f3f5] hover:underline">
                        {message.senderName}
                    </span>
                    <span className="text-[10px] text-[#949ba4]">{timeString}</span>
                </div>

                {isEditing ? (
                    <div className="mt-1 flex w-full flex-col gap-1">
                        <input
                            ref={inputRef}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isSubmitting}
                            className="w-full rounded border border-[#232428] bg-[#383a40] px-3 py-1.5 text-sm text-[#dbdee1] focus:border-[#5865f2] focus:outline-none"
                        />
                        <span className="text-[10px] text-[#949ba4]">
                            escape для
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedContent(message.content);
                                }}
                                className="cursor-pointer text-[#5865f2] hover:underline"
                            >
                                отмены
                            </button>
                            • enter для
                            <button
                                type="button"
                                onClick={handleSaveEdit}
                                className="cursor-pointer text-[#5865f2] hover:underline"
                            >
                                сохранения
                            </button>
                        </span>
                    </div>
                ) : (
                    <p className="mt-0.5 text-sm wrap-break-word whitespace-pre-wrap text-[#dbdee1]">
                        {message.content}
                        {message.isUpdated && (
                            <span className="ml-1 text-[10px] text-[#949ba4] select-none">
                                (изменено)
                            </span>
                        )}
                    </p>
                )}
            </div>

            {chatEndRef && <div ref={chatEndRef} />}
        </div>
    );
}

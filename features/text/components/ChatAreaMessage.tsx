'use client';

import { useState } from 'react';

import Image from 'next/image';

import { toast } from 'sonner';

import { INormalizedMessage } from '../types/message.types';
import MessageActionToolbar from './MessageActionToolbar';
import MessageInlineEditor from './MessageInlineEditor';

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

    const isAuthor = Boolean(currentUserId && message.senderId === currentUserId);

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

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedContent(message.content);
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
            {isAuthor && !isEditing && (
                <MessageActionToolbar
                    onEdit={onEdit ? () => setIsEditing(true) : undefined}
                    onDelete={onDelete ? handleDelete : undefined}
                />
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
                    <MessageInlineEditor
                        value={editedContent}
                        onChange={setEditedContent}
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                        isSubmitting={isSubmitting}
                    />
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

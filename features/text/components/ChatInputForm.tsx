'use client';

import { useState } from 'react';

import { Send } from 'lucide-react';

interface ChatInputFormProps {
    channelName: string;
    isSending: boolean;
    onSendMessage: (content: string) => Promise<void>;
    onTyping?: () => void;
}

export default function ChatInputForm({
    channelName,
    isSending,
    onSendMessage,
    onTyping,
}: ChatInputFormProps) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed || isSending) return;

        setInputValue('');
        try {
            await onSendMessage(trimmed);
        } catch {
            setInputValue(trimmed);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="shrink-0 bg-[#313338] p-4">
            <div className="relative flex items-center rounded-lg bg-[#383a40] px-4 py-2.5">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        onTyping?.();
                    }}
                    placeholder={`Отправить сообщение в #${channelName}`}
                    className="w-full bg-transparent text-sm text-[#dbdee1] placeholder-[#80848e] focus:outline-none"
                    disabled={isSending}
                />
                <button
                    type="submit"
                    disabled={isSending || !inputValue.trim()}
                    className="cursor-pointer text-[#b5bac1] transition-colors hover:text-[#dbdee1] disabled:opacity-40"
                >
                    <Send className="h-5 w-5" />
                </button>
            </div>
        </form>
    );
}

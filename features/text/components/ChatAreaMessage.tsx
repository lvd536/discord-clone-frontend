import Image from 'next/image';

import { INormalizedMessage } from '../types/message.types';

interface IProps {
    message: INormalizedMessage;
    chatEndRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ChatAreaMessage({ message, chatEndRef }: IProps) {
    const timeString = new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
    const initials = message.senderName.substring(0, 2).toUpperCase();

    return (
        <div className="group flex items-start gap-4 rounded p-1.5 transition-all hover:bg-[#2e3035]/30">
            {message.avatarUrl ? (
                <Image
                    src={message.avatarUrl}
                    alt={message.senderName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                />
            ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5865f2] text-xs font-bold text-white">
                    {initials}
                </div>
            )}

            <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-2">
                    <span className="cursor-pointer text-sm font-semibold text-[#f2f3f5] hover:underline">
                        {message.senderName}
                    </span>
                    <span className="text-[10px] text-[#949ba4]">{timeString}</span>
                </div>
                <p className="wrap-break-words mt-0.5 text-sm whitespace-pre-wrap text-[#dbdee1]">
                    {message.content}
                </p>
            </div>
            {chatEndRef && <div ref={chatEndRef} />}
        </div>
    );
}

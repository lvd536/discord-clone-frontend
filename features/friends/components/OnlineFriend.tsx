import { User } from '@backend/types/__generated__/client';
import { MessageSquare, UserMinus } from 'lucide-react';

interface IProps {
    friend: User;
    handleStartChat: (friendId: string) => void;
    handleDeclineOrRemove: (friendId: string) => void;
}

export default function OnlineFriend({ friend, handleDeclineOrRemove, handleStartChat }: IProps) {
    return (
        <div className="group flex items-center justify-between rounded p-2.5 transition-all hover:bg-[#35363c]/40">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5865f2] text-sm font-bold text-white">
                    {friend.displayName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{friend.displayName}</span>
                    <span className="text-xs text-[#23a55a]">В сети</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleStartChat(friend.id)}
                    className="cursor-pointer rounded-full bg-[#2b2d31] p-2 text-[#b5bac1] transition-colors hover:bg-[#35363c] hover:text-[#f2f3f5]"
                    title="Написать сообщение"
                >
                    <MessageSquare className="h-4 w-4" />
                </button>
                <button
                    onClick={() => handleDeclineOrRemove(friend.id)}
                    className="cursor-pointer rounded-full bg-[#2b2d31] p-2 text-[#f23f43] transition-colors hover:bg-[#f23f43] hover:text-white"
                    title="Удалить из друзей"
                >
                    <UserMinus className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

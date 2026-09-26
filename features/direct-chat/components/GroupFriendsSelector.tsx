'use client';

import { User } from '@backend/types/__generated__/client';

interface GroupFriendsSelectorProps {
    friends: User[];
    selectedFriendIds: string[];
    onToggleFriend: (friendId: string) => void;
}

export default function GroupFriendsSelector({
    friends,
    selectedFriendIds,
    onToggleFriend,
}: GroupFriendsSelectorProps) {
    return (
        <div className="space-y-1.5 select-none">
            <label className="text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                Друзья ({selectedFriendIds.length} выбрано)
            </label>

            <div className="discord-scroll max-h-48 space-y-1 overflow-y-auto pr-1">
                {friends.length > 0 ? (
                    friends.map((friend) => {
                        const isChecked = selectedFriendIds.includes(friend.id);
                        return (
                            <div
                                key={friend.id}
                                onClick={() => onToggleFriend(friend.id)}
                                className="flex cursor-pointer items-center justify-between rounded p-2 transition-colors hover:bg-[#35363c]/50"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5865f2] text-xs font-bold text-white uppercase">
                                        {friend.displayName.slice(0, 2)}
                                    </div>
                                    <span className="text-sm font-medium text-[#dbdee1]">
                                        {friend.displayName}
                                    </span>
                                </div>

                                <div
                                    className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                                        isChecked
                                            ? 'border-[#5865f2] bg-[#5865f2]'
                                            : 'border-[#4e5058]'
                                    }`}
                                >
                                    {isChecked && (
                                        <span className="text-xs font-bold text-white">✓</span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="py-4 text-center text-xs text-[#949ba4] italic">
                        У вас пока нет друзей в списке.
                    </p>
                )}
            </div>
        </div>
    );
}

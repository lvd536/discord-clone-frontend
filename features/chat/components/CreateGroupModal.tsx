'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { User } from '@backend/types/__generated__/client';
import { MessageSquarePlus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { createGroupConversation } from '@/features/chat/actions';
import { getFriends } from '@/features/friends/actions';

export default function CreateGroupModal() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [friends, setFriends] = useState<User[]>([]);
    const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            const fetchFriends = async () => {
                const res = await getFriends('ACCEPTED');
                if (res.success && res.data) {
                    setFriends(res.data);
                }
            };
            fetchFriends();
        }
    }, [open]);

    const handleToggleFriend = (friendId: string) => {
        setSelectedFriendIds((prev) =>
            prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId],
        );
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupName.trim() || selectedFriendIds.length < 1 || loading) return;

        setLoading(true);
        try {
            const response = await createGroupConversation({
                name: groupName.trim(),
                friendIds: selectedFriendIds,
            });

            if (response.success && response.data) {
                toast.success('Групповой чат успешно создан!');
                setOpen(false);
                setGroupName('');
                setSelectedFriendIds([]);
                router.refresh();
                router.push(`/dashboard/@me/${response.data.id}`);
            }
        } catch (err) {
            if (err instanceof Error) toast.error(err.message || 'Не удалось создать группу');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <button
                        className="cursor-pointer rounded p-1 text-[#b5bac1] transition-colors hover:bg-[#35363c] hover:text-[#f2f3f5]"
                        title="Создать групповой чат"
                    >
                        <MessageSquarePlus className="h-4 w-4" />
                    </button>
                }
            />

            <DialogContent className="border-none bg-[#313338] text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">
                        Создать групповой чат
                    </DialogTitle>
                    <DialogDescription className="text-center text-xs text-[#949ba4]">
                        Выберите друзей, чтобы пригласить их в новую беседу.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateGroup} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                            Название группы
                        </label>
                        <Input
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Моя супер группа"
                            className="border-none bg-[#1e1f22] text-[#dbdee1] focus-visible:ring-0"
                            autoComplete="off"
                        />
                    </div>

                    <div className="space-y-1.5">
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
                                            onClick={() => handleToggleFriend(friend.id)}
                                            className="flex cursor-pointer items-center justify-between rounded p-2 transition-colors hover:bg-[#35363c]/50"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5865f2] text-xs font-bold text-white uppercase">
                                                    {friend.displayName.slice(0, 2)}
                                                </div>
                                                <span className="text-sm font-medium">
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
                                                    <span className="text-xs font-bold text-white">
                                                        ✓
                                                    </span>
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

                    <div className="flex items-center justify-between pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="text-white hover:bg-transparent hover:underline"
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !groupName.trim() || selectedFriendIds.length < 1}
                            className="bg-[#5865f2] px-6 font-semibold text-white hover:bg-[#4752c4]"
                        >
                            {loading ? 'Создание...' : 'Создать группу'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

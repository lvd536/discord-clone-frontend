'use client';

import { useState } from 'react';

import { MessageSquarePlus } from 'lucide-react';

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

import { useGroupForm } from '../hooks/useGroupForm';
import GroupFriendsSelector from './GroupFriendsSelector';

export default function CreateGroupModal() {
    const [open, setOpen] = useState(false);

    const {
        groupName,
        setGroupName,
        friends,
        selectedFriendIds,
        handleToggleFriend,
        loading,
        handleSubmit,
    } = useGroupForm({
        isOpen: open,
        mode: 'create',
        onClose: () => setOpen(false),
    });

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

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <GroupFriendsSelector
                        friends={friends}
                        selectedFriendIds={selectedFriendIds}
                        onToggleFriend={handleToggleFriend}
                    />

                    <div className="flex items-center justify-between pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="cursor-pointer text-white hover:bg-transparent hover:underline"
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !groupName.trim() || selectedFriendIds.length < 1}
                            className="cursor-pointer bg-[#5865f2] px-6 font-semibold text-white hover:bg-[#4752c4] disabled:opacity-50"
                        >
                            {loading ? 'Создание...' : 'Создать группу'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

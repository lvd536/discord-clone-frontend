'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { useGroupForm } from '../hooks/useGroupForm';
import GroupFriendsSelector from './GroupFriendsSelector';

interface IProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    conversationId: string;
    initialName?: string;
    initialParticipantIds?: string[];
}

export default function EditGroupModal({
    open,
    conversationId,
    initialName = '',
    initialParticipantIds = [],
    onOpenChange,
}: IProps) {
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
        mode: 'edit',
        conversationId,
        initialName,
        initialParticipantIds,
        onClose: () => onOpenChange(false),
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-none bg-[#313338] text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">
                        Изменить групповой чат
                    </DialogTitle>
                    <DialogDescription className="text-center text-xs text-[#949ba4]">
                        Измените название или состав участников группы.
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
                            placeholder="Название группы"
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
                            onClick={() => onOpenChange(false)}
                            className="cursor-pointer text-white hover:bg-transparent hover:underline"
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !groupName.trim() || selectedFriendIds.length < 1}
                            className="cursor-pointer bg-[#5865f2] px-6 font-semibold text-white hover:bg-[#4752c4] disabled:opacity-50"
                        >
                            {loading ? 'Сохранение...' : 'Сохранить изменения'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

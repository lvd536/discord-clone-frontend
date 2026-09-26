'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { User } from '@backend/types/__generated__/client';
import { toast } from 'sonner';

import { getFriends } from '@/features/friends/actions';
import { getErrorMessage } from '@/lib/errors';

import { createGroupConversation, editGroup } from '../actions';

interface UseGroupFormProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    conversationId?: string;
    initialName?: string;
    initialParticipantIds?: string[];
    onClose: () => void;
}

export function useGroupForm({
    isOpen,
    mode,
    conversationId,
    initialName = '',
    initialParticipantIds = [],
    onClose,
}: UseGroupFormProps) {
    const router = useRouter();
    const [groupName, setGroupName] = useState(initialName);
    const [friends, setFriends] = useState<User[]>([]);
    const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>(initialParticipantIds);
    const [loading, setLoading] = useState(false);

    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    if (isOpen !== prevIsOpen) {
        setPrevIsOpen(isOpen);
        if (isOpen) {
            setGroupName(initialName);
            setSelectedFriendIds(initialParticipantIds);
        }
    }

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        const fetchFriends = async () => {
            const res = await getFriends('ACCEPTED');
            if (res.success && res.data && isMounted) {
                setFriends(res.data);
            }
        };
        fetchFriends();

        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    const handleToggleFriend = (friendId: string) => {
        setSelectedFriendIds((prev) =>
            prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId],
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = groupName.trim();
        if (!trimmedName || selectedFriendIds.length < 1 || loading) return;

        setLoading(true);
        try {
            if (mode === 'create') {
                const res = await createGroupConversation({
                    name: trimmedName,
                    friendIds: selectedFriendIds,
                });

                if (res.success && res.data) {
                    toast.success('Групповой чат успешно создан!');
                    onClose();
                    router.refresh();
                    router.push(`/dashboard/me/${res.data.id}`);
                } else if ('error' in res) {
                    throw new Error(res.error);
                }
            } else if (mode === 'edit' && conversationId) {
                const res = await editGroup({
                    conversationId,
                    name: trimmedName,
                    participantIds: selectedFriendIds,
                });

                if (res.success && res.data) {
                    toast.success('Группа успешно обновлена!');
                    onClose();
                    router.refresh();
                } else if ('error' in res) {
                    throw new Error(res.error);
                }
            }
        } catch (err) {
            const message = getErrorMessage(err);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        groupName,
        setGroupName,
        friends,
        selectedFriendIds,
        handleToggleFriend,
        loading,
        handleSubmit,
    };
}

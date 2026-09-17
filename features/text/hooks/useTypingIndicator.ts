import { useEffect, useRef, useState } from 'react';

import { useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';

interface TypingPayload {
    type: 'TYPING';
    userId: string;
    displayName: string;
}

export function useTypingIndicator(currentUserId?: string, currentUsername?: string) {
    const room = useRoomContext();
    const [typingUsers, setTypingUsers] = useState<
        Map<string, { name: string; timeout: NodeJS.Timeout }>
    >(new Map());
    const lastSentRef = useRef<number>(0);

    const sendTyping = async () => {
        if (!room || !currentUserId || !currentUsername) return;
        const now = Date.now();

        if (now - lastSentRef.current < 2000) return;
        lastSentRef.current = now;

        const payload: TypingPayload = {
            type: 'TYPING',
            userId: currentUserId,
            displayName: currentUsername,
        };

        const data = new TextEncoder().encode(JSON.stringify(payload));
        await room.localParticipant.publishData(data, { reliable: false });
    };

    useEffect(() => {
        if (!room) return;

        const handleDataReceived = (payload: Uint8Array) => {
            try {
                const decoded = JSON.parse(new TextDecoder().decode(payload)) as TypingPayload;

                if (decoded.type === 'TYPING' && decoded.userId !== currentUserId) {
                    setTypingUsers((prev) => {
                        const next = new Map(prev);

                        if (next.has(decoded.userId)) {
                            clearTimeout(next.get(decoded.userId)!.timeout);
                        }

                        const timeout = setTimeout(() => {
                            setTypingUsers((cur) => {
                                const updated = new Map(cur);
                                updated.delete(decoded.userId);
                                return updated;
                            });
                        }, 3500);

                        next.set(decoded.userId, { name: decoded.displayName, timeout });

                        return next;
                    });
                }
            } catch {}
        };

        room.on(RoomEvent.DataReceived, handleDataReceived);

        return () => {
            room.off(RoomEvent.DataReceived, handleDataReceived);
        };
    }, [room, currentUserId]);

    const typingNames = Array.from(typingUsers.values()).map((u) => u.name);

    return {
        sendTyping,
        typingNames,
    };
}

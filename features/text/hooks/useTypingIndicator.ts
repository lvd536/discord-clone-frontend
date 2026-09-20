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

    const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());

    const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
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

        const timeouts = timeoutsRef.current;

        const handleDataReceived = (payload: Uint8Array) => {
            try {
                const decoded = JSON.parse(new TextDecoder().decode(payload)) as TypingPayload;

                if (decoded.type === 'TYPING' && decoded.userId !== currentUserId) {
                    const existingTimeout = timeouts.get(decoded.userId);
                    if (existingTimeout) {
                        clearTimeout(existingTimeout);
                    }

                    const timeout = setTimeout(() => {
                        setTypingUsers((cur) => {
                            const updated = new Map(cur);
                            updated.delete(decoded.userId);
                            return updated;
                        });
                        timeouts.delete(decoded.userId);
                    }, 4000);

                    timeouts.set(decoded.userId, timeout);

                    setTypingUsers((prev) => {
                        const next = new Map(prev);
                        next.set(decoded.userId, decoded.displayName);
                        return next;
                    });
                }
            } catch {}
        };

        room.on(RoomEvent.DataReceived, handleDataReceived);

        return () => {
            room.off(RoomEvent.DataReceived, handleDataReceived);
            timeouts.forEach((timeout) => clearTimeout(timeout));
            timeouts.clear();
        };
    }, [room, currentUserId]);

    const typingNames = Array.from(typingUsers.values());

    return {
        sendTyping,
        typingNames,
    };
}

import { useEffect } from 'react';

import { useRoomContext } from '@livekit/components-react';

interface IProps {
    onLeave: () => void;
}

export default function VoiceChannelLifecycleManager({ onLeave }: IProps) {
    const room = useRoomContext();

    useEffect(() => {
        if (!room) return;

        const handleBeforeUnload = () => {
            room.disconnect();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [room, onLeave]);

    return null;
}

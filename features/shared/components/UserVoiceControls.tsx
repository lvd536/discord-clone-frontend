'use client';

import { useState } from 'react';

import { useRoomContext } from '@livekit/components-react';
import {
    Headphones,
    Mic,
    MicOff,
    ScreenShare,
    ScreenShareOff,
    Video,
    VideoOff,
} from 'lucide-react';

export default function UserVoiceControls() {
    const room = useRoomContext();

    const [isMuted, setIsMuted] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    const [screenShareEnabled, setScreenShareEnabled] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);

    const handleToggleMute = () => {
        const nextState = !isMuted;
        setIsMuted(nextState);
        room.localParticipant.setMicrophoneEnabled(!nextState);
    };

    const handleToggleVideo = () => {
        const nextState = !isVideo;
        setIsVideo(nextState);
        room.localParticipant.setCameraEnabled(!nextState);
    };

    const handleToggleScreenShare = () => {
        const nextState = !screenShareEnabled;
        setScreenShareEnabled(nextState);
        room.localParticipant.setScreenShareEnabled(!nextState);
    };

    const handleToggleDeafen = () => {
        const nextState = !isDeafened;
        setIsDeafened(nextState);
        if (nextState) {
            room.localParticipant.setMicrophoneEnabled(false);
            setIsMuted(true);
        } else {
            room.localParticipant.setMicrophoneEnabled(true);
            setIsMuted(false);
        }
    };

    if (!room) return null;

    return (
        <div className="flex items-center gap-0.5">
            <button
                onClick={handleToggleScreenShare}
                className={`cursor-pointer rounded p-1.5 transition-colors hover:bg-[#35363c] ${
                    screenShareEnabled ? 'text-green-400' : 'text-[#dbdee1]'
                }`}
            >
                {screenShareEnabled ? (
                    <ScreenShare className="h-4 w-4" />
                ) : (
                    <ScreenShareOff className="h-4 w-4" />
                )}
            </button>
            <button
                onClick={handleToggleVideo}
                className={`cursor-pointer rounded p-1.5 transition-colors hover:bg-[#35363c] ${
                    isVideo ? 'text-green-400' : 'text-[#dbdee1]'
                }`}
            >
                {screenShareEnabled ? (
                    <Video className="h-4 w-4" />
                ) : (
                    <VideoOff className="h-4 w-4" />
                )}
            </button>
            <button
                onClick={handleToggleMute}
                className={`cursor-pointer rounded p-1.5 transition-colors hover:bg-[#35363c] ${
                    isMuted ? 'text-[#f23f43]' : 'text-[#dbdee1]'
                }`}
            >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
                onClick={handleToggleDeafen}
                className={`cursor-pointer rounded p-1.5 transition-colors hover:bg-[#35363c] ${
                    isDeafened ? 'text-[#f23f43]' : 'text-[#dbdee1]'
                }`}
            >
                <Headphones className="h-4 w-4" />
            </button>
        </div>
    );
}

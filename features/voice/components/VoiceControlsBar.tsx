'use client';

import { useState } from 'react';

import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import {
    Headphones,
    Mic,
    MicOff,
    Monitor,
    MonitorOff,
    PhoneOff,
    Video,
    VideoOff,
} from 'lucide-react';
import { toast } from 'sonner';

import { useVoiceStore } from '@/features/shared/store/voice.store';

interface IProps {
    onDisconnect?: () => void;
}

export default function VoiceControlsBar({ onDisconnect }: IProps) {
    const room = useRoomContext();
    const { localParticipant, isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled } =
        useLocalParticipant();
    const disconnectStore = useVoiceStore((state) => state.disconnect);

    const [isDeafened, setIsDeafened] = useState(false);

    const handleToggleMic = async () => {
        if (!localParticipant) return;
        try {
            await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
        } catch {
            toast.error('Не удалось переключить микрофон. Проверьте разрешения в браузере.');
        }
    };

    const handleToggleCamera = async () => {
        if (!localParticipant) return;
        try {
            await localParticipant.setCameraEnabled(!isCameraEnabled);
        } catch {
            toast.error('Не удалось получить доступ к камере.');
        }
    };

    const handleToggleScreenShare = async () => {
        if (!localParticipant) return;
        try {
            await localParticipant.setScreenShareEnabled(!isScreenShareEnabled, { audio: true });
        } catch (error) {
            if (error instanceof Error && error.name !== 'NotAllowedError') {
                toast.error('Ошибка демонстрации экрана.');
            }
        }
    };

    const handleToggleDeafen = () => {
        const nextState = !isDeafened;
        setIsDeafened(nextState);

        if (nextState) {
            localParticipant.setMicrophoneEnabled(false);
            room.remoteParticipants.forEach((p) => {
                p.audioTrackPublications.forEach((pub) => pub.setEnabled(false));
            });
        } else {
            localParticipant.setMicrophoneEnabled(true);
            room.remoteParticipants.forEach((p) => {
                p.audioTrackPublications.forEach((pub) => pub.setEnabled(true));
            });
        }
    };

    const handleLeave = async () => {
        try {
            if (localParticipant) {
                await localParticipant.setMicrophoneEnabled(false);
                await localParticipant.setCameraEnabled(false);
                await localParticipant.setScreenShareEnabled(false);
            }
            if (onDisconnect) {
                onDisconnect();
            }
            disconnectStore();
        } catch (err) {
            console.error('Ошибка выхода из звонка:', err);
        }
    };

    return (
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-[#1f2023]/80 bg-[#1e1f22]/90 px-4 py-2.5 shadow-2xl backdrop-blur-md transition-all select-none sm:gap-3">
            <button
                onClick={handleToggleCamera}
                className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-all sm:h-12 sm:w-12 ${
                    isCameraEnabled
                        ? 'bg-white text-black shadow-md'
                        : 'bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35363c] hover:text-white'
                }`}
                title={isCameraEnabled ? 'Выключить камеру' : 'Включить камеру'}
            >
                {isCameraEnabled ? (
                    <Video className="h-5 w-5" />
                ) : (
                    <VideoOff className="h-5 w-5 text-[#f23f43]" />
                )}
            </button>

            <button
                onClick={handleToggleScreenShare}
                className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-all sm:h-12 sm:w-12 ${
                    isScreenShareEnabled
                        ? 'bg-[#23a55a] text-white shadow-md'
                        : 'bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35363c] hover:text-white'
                }`}
                title={isScreenShareEnabled ? 'Остановить стрим' : 'Поделиться экраном'}
            >
                {isScreenShareEnabled ? (
                    <Monitor className="h-5 w-5" />
                ) : (
                    <MonitorOff className="h-5 w-5" />
                )}
            </button>

            <button
                onClick={handleToggleMic}
                className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-all sm:h-12 sm:w-12 ${
                    !isMicrophoneEnabled
                        ? 'bg-[#f23f43] text-white'
                        : 'bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35363c] hover:text-white'
                }`}
                title={isMicrophoneEnabled ? 'Выключить микрофон' : 'Включить микрофон'}
            >
                {isMicrophoneEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>

            <button
                onClick={handleToggleDeafen}
                className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-all sm:h-12 sm:w-12 ${
                    isDeafened
                        ? 'bg-[#f23f43] text-white'
                        : 'bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35363c] hover:text-white'
                }`}
                title={isDeafened ? 'Включить звук' : 'Заглушить звук'}
            >
                <Headphones className="h-5 w-5" />
            </button>

            <div className="mx-1 h-6 w-px bg-[#3f4147]/60" />

            <button
                onClick={handleLeave}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#f23f43] text-white shadow-lg shadow-[#f23f43]/20 transition-all hover:bg-[#da373c] sm:h-12 sm:w-12"
                title="Отключиться"
            >
                <PhoneOff className="h-5 w-5" />
            </button>
        </div>
    );
}

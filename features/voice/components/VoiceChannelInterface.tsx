'use client';

import { useEffect, useState } from 'react';

import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { Mic, MicOff, Monitor, PhoneOff, Video, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

import VoiceGrid from './VoiceGrid';

interface IProps {
    channelId: string;
    onLeave: () => void;
    autoStartMic?: boolean;
}

export default function VoiceChannelInterface({ channelId, onLeave, autoStartMic }: IProps) {
    const { localParticipant } = useLocalParticipant();
    const room = useRoomContext();
    const [micEnabled, setMicEnabled] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [screenShareEnabled, setScreenShareEnabled] = useState(false);

    useEffect(() => {
        if (autoStartMic && localParticipant && !micEnabled) {
            const initAudio = async () => {
                try {
                    await localParticipant.setMicrophoneEnabled(true);
                    setMicEnabled(true);
                } catch {
                    console.error('Не удалось автоматически запустить микрофон');
                }
            };
            initAudio();
        }
    }, [localParticipant, autoStartMic, micEnabled]);

    const toggleMicrophone = async () => {
        if (!localParticipant) return;
        try {
            const newState = !micEnabled;
            await localParticipant.setMicrophoneEnabled(newState);
            setMicEnabled(newState);
        } catch {
            toast.error('Не удалось получить доступ к микрофону. Проверьте разрешения в браузере.');
            setMicEnabled(false);
        }
    };

    const toggleCamera = async () => {
        if (!localParticipant) return;
        try {
            const newState = !videoEnabled;
            await localParticipant.setCameraEnabled(newState);
            setVideoEnabled(newState);
        } catch {
            toast.error('Не удалось получить доступ к камере.');
            setVideoEnabled(false);
        }
    };

    const toggleScreenShare = async () => {
        if (!localParticipant) return;
        try {
            const newState = !screenShareEnabled;
            await localParticipant.setScreenShareEnabled(newState, { audio: true });
            setScreenShareEnabled(newState);
        } catch (error) {
            if (error instanceof Error && error?.name !== 'NotAllowedError') {
                toast.error('Ошибка при попытке поделиться экраном.');
            }
            setScreenShareEnabled(false);
        }
    };

    const handleLeaveVoice = async () => {
        try {
            await room.localParticipant.setMicrophoneEnabled(false);
            await room.localParticipant.setCameraEnabled(false);
            await room.localParticipant.setScreenShareEnabled(false);

            room.remoteParticipants.forEach((participant) => {
                participant.trackPublications.forEach((publication) => {
                    if (publication.isSubscribed) {
                        publication.setEnabled(false);
                    }
                });
            });

            onLeave();
        } catch (error) {
            console.error('Ошибка при выходе из голосового звонка:', error);
        }
    };

    return (
        <>
            <div className="flex h-12 w-full shrink-0 items-center justify-between border-b border-[#1f2023] bg-[#313338] px-4 select-none">
                <div className="flex items-center gap-2">
                    <Volume2 className="text-xl text-[#80848e]" />
                    <span className="font-bold text-[#f2f3f5]">{channelId}</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleMicrophone}
                        className={`cursor-pointer rounded-full p-2 transition-colors ${
                            micEnabled
                                ? 'bg-[#23a55a] text-white'
                                : 'bg-[#2b2d31] text-[#f23f43] hover:bg-[#35363c]'
                        }`}
                        title={micEnabled ? 'Выключить микрофон' : 'Включить микрофон'}
                    >
                        {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </button>

                    <button
                        onClick={toggleCamera}
                        className={`cursor-pointer rounded-full p-2 transition-colors ${
                            videoEnabled
                                ? 'bg-[#23a55a] text-white'
                                : 'bg-[#2b2d31] hover:bg-[#35363c]'
                        }`}
                        title="Включить камеру"
                    >
                        <Video className="h-4 w-4" />
                    </button>

                    <button
                        onClick={toggleScreenShare}
                        className={`cursor-pointer rounded-full p-2 transition-colors ${
                            screenShareEnabled
                                ? 'bg-[#23a55a] text-white'
                                : 'bg-[#2b2d31] hover:bg-[#35363c]'
                        }`}
                        title="Поделиться экраном"
                    >
                        <Monitor className="h-4 w-4" />
                    </button>

                    <button
                        onClick={handleLeaveVoice}
                        className="cursor-pointer rounded-full bg-[#f23f43] p-2 text-white transition-colors hover:bg-[#da373c]"
                        title="Отключиться"
                    >
                        <PhoneOff className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-y-auto bg-[#2b2d31] p-6">
                <VoiceGrid />
            </div>
        </>
    );
}

import { useEffect, useState } from 'react';

import { Participant, Track } from 'livekit-client';
import { MicOff, Settings, Volume2, VolumeX } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from '@/components/ui/popover';

export default function ParticipantTile({ participant }: { participant: Participant }) {
    const isSpeaking = participant.isSpeaking;
    const isMuted = !participant.isMicrophoneEnabled;
    const initials = participant.identity.substring(0, 2).toUpperCase();

    const [volume, setVolume] = useState<number>(1);
    const [localMute, setLocalMute] = useState<boolean>(false);

    useEffect(() => {
        const audioPublication = participant.getTrackPublication(Track.Source.Microphone);
        const audioTrack = audioPublication?.audioTrack;

        if (audioTrack && 'setVolume' in audioTrack) {
            audioTrack.setVolume(localMute ? 0 : volume);
        }
    }, [participant, volume, localMute, isMuted]);

    let avatarUrl = '';
    if (participant.metadata) {
        try {
            const parsedMetadata = JSON.parse(participant.metadata);
            avatarUrl = parsedMetadata.avatar;
        } catch {
            console.error('Ошибка парсинга аватара в сетке звонка');
        }
    }

    return (
        <div className="group relative flex aspect-square w-full max-w-45 flex-col items-center justify-center rounded-lg border border-[#1e1f22]/50 bg-[#2b2d31] p-4 transition-all hover:bg-[#2f3136]">
            {!participant.isLocal && (
                <div className="absolute top-2 right-2 z-20 opacity-0 transition-opacity group-hover:opacity-100">
                    <Popover>
                        <PopoverTrigger
                            render={
                                <button className="cursor-pointer rounded bg-[#1e1f22]/60 p-1 text-[#b5bac1] transition-colors hover:bg-[#1e1f22] hover:text-[#f2f3f5]">
                                    <Settings className="h-3.5 w-3.5" />
                                </button>
                            }
                        />
                        <PopoverContent className="w-56" align="end">
                            <PopoverHeader>
                                <PopoverTitle className="text-xs text-[#949ba4]">
                                    Настройки {participant.name || participant.identity}
                                </PopoverTitle>
                            </PopoverHeader>
                            <div className="space-y-1.5 p-2">
                                <div className="flex items-center justify-between text-xs font-semibold text-[#dbdee1]">
                                    <span className="flex items-center gap-1">
                                        <Volume2 className="h-3.5 w-3.5" /> Громкость звука
                                    </span>
                                    <span>{Math.round((localMute ? 0 : volume) * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={localMute ? 0 : volume}
                                    onChange={(e) => {
                                        setVolume(parseFloat(e.target.value));
                                        if (localMute) setLocalMute(false);
                                    }}
                                    className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-[#1e1f22] accent-[#5865f2]"
                                />
                            </div>

                            <Button
                                onClick={() => setLocalMute(!localMute)}
                                className={`flex cursor-pointer items-center gap-2 ${localMute ? 'text-[#f23f43]' : ''}`}
                            >
                                <VolumeX className="h-4 w-4" />
                                <span>{localMute ? 'Включить звук' : 'Заглушить для себя'}</span>
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
            )}

            <div className="relative">
                <Avatar
                    className={`h-20 w-20 transition-all duration-150 ${
                        isSpeaking
                            ? 'scale-105 shadow-[0_0_15px_rgba(35,165,90,0.6)] ring-4 ring-[#23a55a]'
                            : 'ring-0'
                    }`}
                >
                    <AvatarImage src={avatarUrl} alt={initials} className="object-cover" />
                    <AvatarFallback className="bg-[#5865f2] text-2xl font-bold text-white">
                        {initials}
                    </AvatarFallback>
                </Avatar>

                {isMuted && (
                    <div className="absolute right-0 bottom-0 z-10 rounded-full border-4 border-[#2b2d31] bg-[#f23f43] p-1.5">
                        <MicOff className="h-3.5 w-3.5 text-white" />
                    </div>
                )}
            </div>

            <div className="mt-4 flex max-w-full flex-col items-center">
                <span className="max-w-full truncate text-sm font-medium text-[#dbdee1]">
                    {participant.name || participant.identity}
                </span>
                {localMute && (
                    <span className="mt-1 rounded bg-[#f23f43]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#f23f43]">
                        Заглушен вами
                    </span>
                )}
            </div>
        </div>
    );
}

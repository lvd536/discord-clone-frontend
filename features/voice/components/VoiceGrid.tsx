'use client';

import { TrackReference, VideoTrack, useParticipants, useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { MicOff } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function VoiceGrid() {
    const participants = useParticipants();

    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: false },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
            { source: Track.Source.ScreenShareAudio, withPlaceholder: false },
        ],
        { onlySubscribed: true },
    );

    const hasVideo = tracks.length > 0;

    if (hasVideo) {
        return (
            <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2">
                {tracks.map((trackRef) => {
                    const participant = trackRef.participant;
                    const isScreenShare = trackRef.source === Track.Source.ScreenShare;
                    const isSpeaking = participant.isSpeaking;

                    return (
                        <div
                            key={`${participant.identity}-${trackRef.source}`}
                            className={`relative aspect-video overflow-hidden rounded-lg border-2 bg-[#1e1f22] transition-all ${
                                isSpeaking ? 'border-[#23a55a]' : 'border-transparent'
                            }`}
                        >
                            <VideoTrack
                                trackRef={trackRef as TrackReference}
                                className="h-full w-full object-cover"
                            />

                            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 text-xs">
                                <span>{isScreenShare ? 'Демонстрация экрана:' : 'Камера'}</span>
                                <span className="font-medium">
                                    {participant.name || participant.identity}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="grid w-full grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {participants.map((p) => {
                const isSpeaking = p.isSpeaking;
                const isMuted = !p.isMicrophoneEnabled;

                const initials = p.identity.substring(0, 2).toUpperCase();

                let avatarUrl = '';
                if (p.metadata) {
                    const parsedMetadata = JSON.parse(p.metadata);
                    avatarUrl = parsedMetadata.avatar;
                }

                return (
                    <div
                        key={p.sid}
                        className="group relative flex aspect-square w-full max-w-45 flex-col items-center justify-center rounded-lg border border-[#1e1f22]/50 bg-[#2b2d31] p-4"
                    >
                        <div className="relative">
                            <Avatar
                                className={`h-20 w-20 transition-all duration-150 ${
                                    isSpeaking
                                        ? 'scale-105 shadow-[0_0_15px_rgba(35,165,90,0.6)] ring-4 ring-[#23a55a]'
                                        : 'ring-0'
                                }`}
                            >
                                <AvatarImage
                                    src={avatarUrl}
                                    alt={initials}
                                    className="object-cover"
                                />

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

                        <span className="mt-4 max-w-full truncate text-sm font-medium text-[#dbdee1]">
                            {p.name || p.identity}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

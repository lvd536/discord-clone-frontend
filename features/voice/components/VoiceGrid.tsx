'use client';

import { TrackReference, VideoTrack, useParticipants, useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { Monitor } from 'lucide-react';

import ParticipantTile from './ParticipantTile';

export default function VoiceGrid() {
    const participants = useParticipants();

    const tracks = useTracks(
        [
            { source: Track.Source.ScreenShare, withPlaceholder: false },
            { source: Track.Source.Camera, withPlaceholder: false },
        ],
        { onlySubscribed: true },
    );

    const screenShareTrack = tracks.find((t) => t.source === Track.Source.ScreenShare);
    const cameraTracks = tracks.filter((t) => t.source === Track.Source.Camera);

    if (screenShareTrack) {
        return (
            <div className="flex h-full w-full flex-col gap-3 overflow-hidden p-4 pb-24">
                <div className="relative flex w-full flex-1 items-center justify-center overflow-hidden rounded-2xl border border-[#1f2023]/60 bg-black shadow-2xl">
                    <VideoTrack
                        trackRef={screenShareTrack as TrackReference}
                        className="h-full w-full object-contain"
                    />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-black/70 px-2.5 py-1 text-xs text-white backdrop-blur-md">
                        <Monitor className="h-3.5 w-3.5 text-[#23a55a]" />
                        <span className="font-semibold">
                            {screenShareTrack.participant.name ||
                                screenShareTrack.participant.identity}
                        </span>
                    </div>
                </div>

                {participants.length > 1 && (
                    <div className="discord-scroll flex h-24 shrink-0 items-center justify-center gap-3 overflow-x-auto py-1">
                        {participants.map((p) => (
                            <div key={p.sid} className="h-20 w-32 shrink-0">
                                <ParticipantTile participant={p} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (cameraTracks.length > 0) {
        return (
            <div className="discord-scroll grid h-full w-full auto-rows-fr grid-cols-1 items-center justify-center gap-4 overflow-y-auto p-4 pb-24 sm:grid-cols-2 md:grid-cols-3">
                {cameraTracks.map((trackRef) => {
                    const participant = trackRef.participant;
                    const isSpeaking = participant.isSpeaking;

                    return (
                        <div
                            key={`${participant.identity}-${trackRef.source}`}
                            className={`relative aspect-video h-full max-h-105 w-full overflow-hidden rounded-2xl border-2 bg-[#1e1f22] shadow-xl transition-all ${
                                isSpeaking
                                    ? 'border-[#23a55a] shadow-[0_0_15px_rgba(35,165,90,0.4)]'
                                    : 'border-transparent'
                            }`}
                        >
                            <VideoTrack
                                trackRef={trackRef as TrackReference}
                                className="h-full w-full object-cover"
                            />

                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-md">
                                <span className="max-w-35 truncate font-medium">
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
        <div className="discord-scroll flex h-full w-full items-center justify-center overflow-y-auto p-6 pb-24">
            <div className="grid w-full max-w-5xl grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {participants.map((p) => (
                    <div key={p.sid} className="aspect-4/3 w-full max-w-55">
                        <ParticipantTile participant={p} />
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client';

import { TrackReference, VideoTrack, useParticipants, useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';

import ParticipantTile from './ParticipantTile';

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
            {participants.map((p) => (
                <ParticipantTile key={p.sid} participant={p} />
            ))}
        </div>
    );
}

import { VideoTrack, useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';

export default function VoiceStreamsGrid() {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
            { source: Track.Source.ScreenShareAudio, withPlaceholder: false },
        ],
        { onlySubscribed: false },
    );

    return (
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((trackReference) => {
                const participant = trackReference.participant;
                const isScreenShare = trackReference.source === Track.Source.ScreenShare;

                return (
                    <div key={trackReference.participant.identity}>
                        {trackReference.publication?.isSubscribed ? (
                            <div className="h-full w-full">
                                <VideoTrack
                                    trackRef={trackReference}
                                    className="h-full w-full object-contain"
                                />

                                <span className="absolute top-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-gray-200">
                                    {isScreenShare ? '📺 Стрим экрана' : '📹 Камера'}
                                </span>
                            </div>
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center p-4">
                                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#5865f2] text-xl font-bold shadow-md">
                                    {participant.identity.substring(0, 2).toUpperCase()}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

import { useParticipants } from '@livekit/components-react';

export default function CustomParticipantsList() {
    const participants = useParticipants();

    return (
        <>
            {participants.map((participant) => {
                const isSpeaking = participant.isSpeaking;

                return (
                    <div
                        key={participant.sid}
                        className={`flex flex-col items-center rounded-xl border-2 bg-[#2b2d31] p-4 transition-all ${isSpeaking ? 'border-[#23a55a] shadow-[0_0_10px_rgba(35,165,90,0.5)]' : 'border-transparent'}`}
                    >
                        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#5865f2] text-xl font-bold">
                            {participant.identity.substring(0, 2).toUpperCase()}
                        </div>

                        <span className="max-w-full truncate text-sm font-medium">
                            {participant.name || participant.identity}
                        </span>

                        {!participant.isMicrophoneEnabled && (
                            <span className="mt-1 text-xs text-red-400">Мут</span>
                        )}
                    </div>
                );
            })}
        </>
    );
}

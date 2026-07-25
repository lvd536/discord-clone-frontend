'use client';

import VoiceChannelInterface from './VoiceChannelInterface';

interface IProps {
    channelId: string;
}

export default function VoiceChannel({ channelId }: IProps) {
    return <VoiceChannelInterface channelId={channelId} />;
}

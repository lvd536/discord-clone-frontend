import { getChannelInfo } from '@/features/shared/actions';
import TextChannel from '@/features/text/components/TextChannel';
import VoiceChannelWrapper from '@/features/voice/components/VoiceChannelWrapper';

interface ChannelPageProps {
    params: Promise<{
        serverId: string;
        channelId: string;
    }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
    const { serverId, channelId } = await params;
    const channelResponse = await getChannelInfo(serverId, channelId);
    const channel = channelResponse.success ? channelResponse.data : null;

    if (!channel || !channelResponse.success) {
        return (
            <div className="flex flex-1 items-center justify-center bg-[#313338] text-white">
                Канал не найден или ошибка сервера
            </div>
        );
    }

    if (channel.type === 'TEXT') {
        return <TextChannel serverId={serverId} channelId={channelId} channelName={channel.name} />;
    }

    if (channel.type === 'VOICE') {
        return (
            <VoiceChannelWrapper
                serverId={serverId}
                channelId={channelId}
                channelName={channel.name || 'Lobby'}
            />
        );
    }

    return (
        <div className="flex flex-1 items-center justify-center bg-[#313338] text-white">
            Неподдерживаемый тип канала
        </div>
    );
}

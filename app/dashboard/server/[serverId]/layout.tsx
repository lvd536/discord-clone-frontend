import { getProfile } from '@/features/auth/actions';
import { getServerInfo, getUserServers } from '@/features/server/actions';
import ServerSidebar from '@/features/server/components/ServerSidebar';
import MobileSidebar from "@/features/shared/components/MobileSidebar";

interface IProps {
    params: Promise<{ serverId: string }>;
    children: React.ReactNode;
}

export default async function ServerLayout({ params, children }: IProps) {
    const { serverId } = await params;

    const [userResponse, serverResponse, userServersResponse] = await Promise.all([
        getProfile(),
        getServerInfo(serverId),
        getUserServers(),
    ]);

    const serverInfo = serverResponse.success ? serverResponse.data : null;
    const user = userResponse.success ? userResponse.data : null;
    const userServers = userServersResponse.success ? userServersResponse.data : [];

    if (!serverInfo || !user) return null;

    return (
        <div className="flex flex-1 overflow-hidden">
            <ServerSidebar serverInfo={serverInfo} user={user} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="z-30 flex h-12 w-full shrink-0 items-center justify-between border-b border-[#1f2023] bg-[#313338] px-4 select-none md:hidden">
                    <div className="flex items-center gap-2">
                        <MobileSidebar
                            userServers={userServers}
                            serverInfo={serverInfo}
                            user={user}
                        />
                        <span className="max-w-40 truncate text-sm font-bold text-white">
                            {serverInfo.name}
                        </span>
                    </div>
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
            </div>
        </div>
    );
}

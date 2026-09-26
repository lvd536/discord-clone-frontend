import { redirect } from 'next/navigation';

import { getProfile } from '@/features/auth/actions';
import { getUserConversations } from '@/features/direct-chat/actions';
import DirectSidebar from '@/features/direct-chat/components/DirectSidebar';
import { getUserServers } from '@/features/server/actions';
import { MobileSidebar } from '@/features/shared/components';
import { ROUTES } from '@/features/shared/constants/route.constants';

interface IProps {
    children: React.ReactNode;
}

export default async function DirectLayout({ children }: IProps) {
    const [userResponse, conversationsResponse, userServersResponse] = await Promise.all([
        getProfile(),
        getUserConversations(),
        getUserServers(),
    ]);

    const conversations = conversationsResponse.success ? conversationsResponse.data : null;
    const user = userResponse.success ? userResponse.data : null;
    const userServers = userServersResponse.success ? userServersResponse.data : null;

    if (!user || !userServers) return redirect(ROUTES.AUTH.LOGIN);

    return (
        <div className="flex flex-1 overflow-hidden">
            <DirectSidebar user={user} conversations={conversations} />

            <div className="z-30 flex h-12 w-full shrink-0 items-center justify-between bg-[#313338] px-4 select-none md:hidden">
                <MobileSidebar
                    userServers={userServers}
                    user={user}
                    conversations={conversations}
                />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
        </div>
    );
}

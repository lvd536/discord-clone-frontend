import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { ROUTES } from '@/constants/route.constants';
import { getProfile } from '@/features/auth/actions';
import { getUserServers } from '@/features/server/actions';
import ServerCreationModal from '@/features/server/components/ServerCreationModal';
import ServerJoinModal from '@/features/server/components/ServerJoinModal';
import RootMobileHeader from '@/features/shared/components/RootMobileHeader';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [userServersResponse, userResponse] = await Promise.all([getUserServers(), getProfile()]);

    if (!userServersResponse.success || !userResponse.success) return redirect('/auth/login');

    const userServers = userServersResponse.data;
    const user = userResponse.data;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#313338] font-sans text-[#dbdee1]">
            <div className="z-20 hidden w-18 shrink-0 flex-col items-center gap-2 bg-[#1e1f22] py-3 md:flex">
                <Link
                    href={ROUTES.DASHBOARD.ME.BASE}
                    className="group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-[24px] bg-[#313338] text-white transition-all duration-200 hover:rounded-[16px] hover:bg-[#5865f2]"
                >
                    <span className="text-sm font-bold">DM</span>
                </Link>
                <div className="my-1 h-0.5 w-8 rounded bg-[#35363c]" />
                <ul className="my-2 space-y-2">
                    {userServers.length > 0 &&
                        userServers.map((server) => (
                            <li
                                key={server.id}
                                className="group relative flex h-12 w-12 shrink-0 items-center justify-center"
                            >
                                <Link
                                    href={ROUTES.DASHBOARD.SERVER.ID(server.id)}
                                    className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-[24px] bg-[#313338] text-white transition-all duration-200 group-hover:rounded-[16px] group-hover:bg-[#5865f2]"
                                >
                                    <Avatar className="rounded-inherit h-full w-full">
                                        <AvatarImage
                                            src={server.imageUrl ?? ''}
                                            alt={server.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-transparent text-sm font-bold text-white uppercase">
                                            {server.name.slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                            </li>
                        ))}
                </ul>
                <ServerCreationModal />
                <ServerJoinModal />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
                <RootMobileHeader userServers={userServers} user={user} />
                {children}
            </div>
        </div>
    );
}

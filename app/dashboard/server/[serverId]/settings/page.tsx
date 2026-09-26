'use server';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { X } from 'lucide-react';
import { getServerInfo } from '@/features/server/actions';
import { ROUTES } from '@/features/shared/constants/route.constants';
import ServerSettingsSheet from "@/features/server-settings/components/ServerSettingsSheet";
import SettingsMembersTab from "@/features/server-settings/components/SettingsMembersTab";
import SettingsRolesTab from "@/features/server-settings/components/SettingsRolesTab";
import SettingsServerTab from "@/features/server-settings/components/SettingsServerTab";

interface IProps {
    params: Promise<{ serverId: string }>;
    searchParams: Promise<{ page?: 'server' | 'members' | 'roles' }>;
}

export default async function SettingsPage({ params, searchParams }: IProps) {
    const { serverId } = await params;
    const { page } = await searchParams;
    const serverInfoResponse = await getServerInfo(serverId);

    if (!serverInfoResponse.success) redirect('/dashboard');

    const serverInfo = serverInfoResponse.data;
    const { channels, members, roles, ...server } = serverInfo;

    return (
        <div className="fixed inset-0 z-100 flex h-screen w-screen overflow-hidden bg-[#313338] font-sans text-[#dbdee1] antialiased">
            <ServerSettingsSheet serverId={serverId} />

            <main className="relative flex flex-1 justify-between overflow-y-auto bg-[#313338] px-6 py-15 md:px-10">
                <div className="w-full">
                    {page === 'roles' ? (
                        <SettingsRolesTab roles={roles} serverId={serverId} />
                    ) : page === 'members' ? (
                        <SettingsMembersTab members={members} roles={roles} />
                    ) : (
                        <SettingsServerTab
                            server={server}
                            channelsCount={channels.length}
                            membersCount={members.length}
                        />
                    )}
                </div>

                <div className="hidden w-15 shrink-0 pl-5 lg:block">
                    <Link
                        href={ROUTES.DASHBOARD.SERVER.ID(serverId)}
                        className="group flex flex-col items-center gap-1 text-center"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#b5bac1] text-[#b5bac1] transition-colors duration-100 group-hover:border-[#dbdee1] group-hover:bg-[#f2f3f5]/10 group-hover:text-[#dbdee1]">
                            <X size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-[12px] font-bold tracking-wide text-[#b5bac1] uppercase group-hover:text-[#dbdee1]">
                            ESC
                        </span>
                    </Link>
                </div>
            </main>
        </div>
    );
}

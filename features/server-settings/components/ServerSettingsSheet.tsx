'use client';

import Link from 'next/link';

import { Home, Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { ROUTES } from '@/constants/route.constants';

import ServerSettingsLinks from './ServerSettingsLinks';

interface IProps {
    serverId: string;
}

export default function ServerSettingsSheet({ serverId }: IProps) {
    const menuItems = [
        {
            id: 'server',
            label: 'Профиль сервера',
            href: ROUTES.DASHBOARD.SERVER.SETTINGS.SERVER(serverId),
        },
        { id: 'roles', label: 'Роли', href: ROUTES.DASHBOARD.SERVER.SETTINGS.ROLES(serverId) },
        {
            id: 'members',
            label: 'Участники',
            href: ROUTES.DASHBOARD.SERVER.SETTINGS.MEMBERS(serverId),
        },
    ];

    return (
        <>
            <div className="absolute top-4 left-4 z-50 md:hidden">
                <Sheet>
                    <SheetTrigger
                        render={
                            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#313338] text-[#b5bac1] hover:text-[#dbdee1]">
                                <Menu size={20} />
                            </button>
                        }
                    />
                    <SheetContent
                        side="left"
                        className="z-999 w-60 border-none bg-[#2b2d31] p-0 outline-none"
                    >
                        <div className="border-b border-[#1f2023] p-4">
                            <Link
                                href={ROUTES.DASHBOARD.BASE}
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#b5bac1] transition-colors hover:bg-[#35373c] hover:text-[#dbdee1]"
                            >
                                <Home size={20} />
                                <span>На главную</span>
                            </Link>
                        </div>
                        <ServerSettingsLinks menuItems={menuItems} />
                    </SheetContent>
                </Sheet>
            </div>

            <aside className="hidden w-60 shrink-0 bg-[#2b2d31] md:block">
                <div className="flex h-full flex-col justify-between overflow-y-auto bg-[#2b2d31]">
                    <div className="w-54.5 self-end justify-self-end pr-2">
                        <div className="border-b border-[#1f2023] p-4">
                            <Link
                                href={ROUTES.DASHBOARD.BASE}
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#b5bac1] transition-colors hover:bg-[#35373c] hover:text-[#dbdee1]"
                            >
                                <Home size={20} />
                                <span>На главную</span>
                            </Link>
                        </div>
                        <ServerSettingsLinks menuItems={menuItems} />
                    </div>
                </div>
            </aside>
        </>
    );
}

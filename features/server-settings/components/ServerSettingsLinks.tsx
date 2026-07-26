'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface IProps {
    menuItems: {
        id: string;
        label: string;
        href: string;
    }[];
}

export default function ServerSettingsLinks({ menuItems }: IProps) {
    const searchParams = useSearchParams();
    const currentPage = searchParams.get('page') || 'server';

    return (
        <nav className="flex flex-col gap-0.5 px-2 py-15 md:pt-15">
            <div className="mb-2 px-2 text-xs font-bold tracking-wider text-[#949ba4] uppercase">
                Настройки сервера
            </div>
            {menuItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`flex h-10 items-center rounded px-2.5 text-[15px] font-medium transition-colors duration-150 ${
                            isActive
                                ? 'bg-[#404249] text-white'
                                : 'text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1] active:bg-[#3f4248] active:text-white'
                        }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}

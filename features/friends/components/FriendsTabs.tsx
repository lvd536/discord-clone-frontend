import { Users } from 'lucide-react';

import { TabType } from '../types';

interface IProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

export default function FriendsTabs({ activeTab, setActiveTab }: IProps) {
    return (
        <div className="flex h-12 w-full shrink-0 items-center justify-between border-b border-[#1f2023] bg-[#313338] px-4 select-none">
            <div className="no-scrollbar flex items-center gap-4 overflow-x-auto">
                <span className="flex items-center gap-2 text-sm font-bold text-white">
                    <Users className="h-5 w-5 text-[#80848e]" />
                    Друзья
                </span>
                <div className="h-4 w-px bg-[#3f4147]" />

                <div className="flex items-center gap-2 text-sm font-medium">
                    <button
                        onClick={() => setActiveTab('ONLINE')}
                        className={`cursor-pointer rounded px-2 py-1 transition-colors ${
                            activeTab === 'ONLINE'
                                ? 'bg-[#3f4147] text-white'
                                : 'text-[#b5bac1] hover:bg-[#35363c]'
                        }`}
                    >
                        В сети
                    </button>
                    <button
                        onClick={() => setActiveTab('ALL')}
                        className={`cursor-pointer rounded px-2 py-1 transition-colors ${
                            activeTab === 'ALL'
                                ? 'bg-[#3f4147] text-white'
                                : 'text-[#b5bac1] hover:bg-[#35363c]'
                        }`}
                    >
                        Все
                    </button>
                    <button
                        onClick={() => setActiveTab('PENDING')}
                        className={`cursor-pointer rounded px-2 py-1 transition-colors ${
                            activeTab === 'PENDING'
                                ? 'bg-[#3f4147] text-white'
                                : 'text-[#b5bac1] hover:bg-[#35363c]'
                        }`}
                    >
                        Ожидание
                    </button>
                    <button
                        onClick={() => setActiveTab('ADD_FRIEND')}
                        className={`cursor-pointer rounded px-2 py-1 font-semibold transition-colors ${
                            activeTab === 'ADD_FRIEND'
                                ? 'bg-transparent text-[#23a55a]'
                                : 'bg-[#23a55a] text-white hover:bg-[#1a7f37]'
                        }`}
                    >
                        Добавить в друзья
                    </button>
                </div>
            </div>
        </div>
    );
}

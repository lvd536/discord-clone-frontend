'use client';

import { useState } from 'react';

import { Server } from '@backend/types/__generated__/client';
import { Check, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { editServer } from '@/features/server/actions';

interface IProps {
    membersCount: number;
    channelsCount: number;
    server: Server;
}

export default function SettingsServerTab({ server, channelsCount, membersCount }: IProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [serverName, setServerName] = useState(server.name);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!serverName.trim() || serverName === server.name) {
            setIsEditing(false);
            return;
        }

        try {
            setIsLoading(true);
            await editServer({
                serverId: server.id,
                name: serverName,
                imageUrl: server.imageUrl ?? undefined,
            });
            setIsEditing(false);
        } catch (error) {
            if (error instanceof Error) {
                toast.error('Не удалось обновить сервер:', { description: error.message });
            } else {
                toast.error('Непредвиденная ошибка при обновлении сервера:');
            }
            setServerName(server.name);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setServerName(server.name);
        setIsEditing(false);
    };

    return (
        <div className="w-full max-w-2xl rounded-lg bg-[#2b2d31] p-4 font-sans text-[#dbdee1] antialiased selection:bg-[#5865f2]/30">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 shrink-0 rounded-[24px] transition-all duration-300 ease-in-out hover:rounded-[16px]">
                    <AvatarImage
                        src={server.imageUrl ?? ''}
                        alt={serverName}
                        className="h-full w-full object-cover"
                    />
                    <AvatarFallback className="flex h-full w-full items-center justify-center bg-[#35363c] text-xl font-medium text-[#f2f3f5] uppercase">
                        {serverName.slice(0, 2)}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                    {isEditing ? (
                        <div className="flex max-w-md items-center gap-2">
                            <Input
                                value={serverName}
                                onChange={(e) => setServerName(e.target.value)}
                                disabled={isLoading}
                                className="h-9 border-[#1e1f22] bg-[#1e1f22] text-lg font-semibold text-[#f2f3f5] focus-visible:ring-2 focus-visible:ring-[#5865f2] focus-visible:ring-offset-0"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSave();
                                    if (e.key === 'Escape') handleCancel();
                                }}
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleSave}
                                disabled={isLoading}
                                className="h-9 w-9 text-[#23a55a] hover:bg-[#23a55a]/10 hover:text-[#23a55a]"
                            >
                                <Check className="h-5 w-5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="h-9 w-9 text-[#f23f43] hover:bg-[#f23f43]/10 hover:text-[#f23f43]"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="group flex items-center gap-2">
                            <h2 className="truncate text-xl font-bold text-[#f2f3f5]">
                                {serverName}
                            </h2>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setIsEditing(true)}
                                className="h-7 w-7 text-[#b5bac1] opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-[#35363c] hover:text-[#dbdee1]"
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    <div className="mt-1.5 flex items-center gap-3 text-xs font-medium text-[#b5bac1]">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#23a55a]" />
                            <span>{membersCount} Участников</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#b5bac1]" />
                            <span>{channelsCount} Каналов</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

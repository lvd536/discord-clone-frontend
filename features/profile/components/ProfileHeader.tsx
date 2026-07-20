import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { useAuthCookie } from '@/features/auth/hooks/useAuthCookie';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { api } from '@/lib/api/api';

export default function ProfileHeader() {
    const { profile, clearUser } = useAuthStore();
    const { removeAuthToken } = useAuthCookie();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
        } finally {
            removeAuthToken();
            if (clearUser) clearUser();
            toast.success('Вы вышли из системы');
            router.push('/auth/login');
        }
    };

    if (!profile) return null;

    const initials = profile.displayName ? profile.displayName.slice(0, 2).toUpperCase() : 'U';

    return (
        <div className="relative px-6 pb-4">
            <div className="absolute -top-11 left-6">
                {profile.avatarUrl ? (
                    <Image
                        src={profile.avatarUrl}
                        alt={profile.displayName}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-full border-[6px] border-[#1e1f22] object-cover"
                        priority
                    />
                ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-[#1e1f22] bg-[#5865f2] text-2xl font-bold text-white uppercase">
                        {initials}
                    </div>
                )}
            </div>

            <div className="h-11" />

            <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg leading-none font-bold text-white">
                            {profile.displayName}
                        </h2>
                        {profile.isVerified && (
                            <ShieldCheck className="h-4.5 w-4.5 fill-[#23a55a]/20 text-[#23a55a]" />
                        )}
                    </div>
                    <span className="mt-1 block text-xs font-medium text-[#949ba4]">
                        {profile.email}
                    </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <span className="text-secondary-foreground rounded bg-[#2b2d31] px-2.5 py-1 text-xs font-semibold">
                        {profile.role}
                    </span>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleLogout}
                        className="cursor-pointer bg-[#f23f43] text-white hover:bg-[#da373c]"
                    >
                        Выйти
                    </Button>
                </div>
            </div>
        </div>
    );
}

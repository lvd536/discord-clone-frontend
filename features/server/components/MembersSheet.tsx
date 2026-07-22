'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';

import { ServerMembersType } from '@/features/shared/types/channel.types';

import MemberList from './MemberList';

interface IProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    members: ServerMembersType;
}

export default function MembersSheet({ members, open, onOpenChange }: IProps) {
    return (
        <>
            <div className="md:hidden">
                <Sheet open={open} onOpenChange={onOpenChange}>
                    <SheetContent
                        side="right"
                        className="w-60 max-w-60 border-none bg-[#2b2d31] p-0"
                    >
                        <MemberList members={members} />
                    </SheetContent>
                </Sheet>
            </div>

            <aside className="hidden h-full w-60 shrink-0 border-none bg-[#2b2d31] md:flex">
                <MemberList members={members} />
            </aside>
        </>
    );
}

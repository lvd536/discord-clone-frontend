import { Role } from '@backend/types/__generated__/client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { ServerMembersType } from '@/features/shared/types/channel.types';

import MemberEditModal from './MemberEditModal';

interface IProps {
    members: ServerMembersType;
    roles: Role[];
}

export default function SettingsMembersTab({ members, roles }: IProps) {
    return (
        <div className="w-full [&>div]:rounded-sm">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Аватар</TableHead>
                        <TableHead>Имя</TableHead>
                        <TableHead>Роли</TableHead>
                        <TableHead>Дата создания</TableHead>
                        <TableHead>Дата изменения</TableHead>
                        <TableHead className="w-0 text-end">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.map((member) => (
                        <TableRow key={member.id} className="has-data-[state=checked]:bg-muted/50">
                            <TableCell>
                                <Avatar
                                    className="overflow-hidden rounded-sm after:rounded-[inherit]"
                                    size="lg"
                                >
                                    <AvatarImage
                                        src={member.user.avatarUrl}
                                        alt={member.user.displayName}
                                        className="rounded-none!"
                                    />
                                    <AvatarFallback
                                        className={'text-foreground rounded-none! bg-[#5865f2]'}
                                    >
                                        {(member.user.displayName ?? member.user.email).slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>
                                <span className="font-medium">{member.user.displayName}</span>
                            </TableCell>
                            <TableCell>
                                <ul className="flex flex-wrap items-center gap-2">
                                    {member.roles.map((r) => (
                                        <li
                                            className="mt-0.5 rounded-full px-2 py-px text-xs font-medium text-white"
                                            style={{ backgroundColor: r.color }}
                                            key={`${member.id}-${r.id}`}
                                        >
                                            {r.name}
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(member.updatedAt).toLocaleDateString()}</TableCell>
                            <TableCell className="flex justify-end">
                                <MemberEditModal member={member} roles={roles} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

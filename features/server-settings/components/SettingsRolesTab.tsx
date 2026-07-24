import { Role } from '@backend/types/__generated__/client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import RoleCreateModal from './RoleCreateModal';
import RoleDeleteAlert from './RoleDeleteAlert';
import RoleEditModal from './RoleEditModal';

interface IProps {
    roles: Role[];
    serverId: string;
}

export default function SettingsRolesTab({ roles, serverId }: IProps) {
    return (
        <div className="w-full [&>div]:rounded-sm">
            <RoleCreateModal serverId={serverId} />
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Название</TableHead>
                        <TableHead>Цвет</TableHead>
                        <TableHead>Права</TableHead>
                        <TableHead>Дата создания</TableHead>
                        <TableHead>Дата изменения</TableHead>
                        <TableHead className="w-0 text-end">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role) => (
                        <TableRow key={role.id} className="has-data-[state=checked]:bg-muted/50">
                            <TableCell>{role.name}</TableCell>
                            <TableCell>
                                <div
                                    className="h-5 w-5 rounded-sm"
                                    style={{ backgroundColor: role.color }}
                                />
                            </TableCell>
                            <TableCell>
                                <ul className="flex flex-wrap items-center gap-2">
                                    {role.permissions.map((p) => (
                                        <li
                                            className="mt-0.5 rounded-full px-2 py-px text-xs font-medium text-white"
                                            key={`${role.id}-${p}`}
                                        >
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(role.updatedAt).toLocaleDateString()}</TableCell>
                            <TableCell className="flex justify-end">
                                <RoleEditModal role={role} />
                                <RoleDeleteAlert
                                    roleName={role.name}
                                    roleId={role.id}
                                    serverId={serverId}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

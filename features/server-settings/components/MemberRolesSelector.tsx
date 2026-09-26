'use client';

import { Role } from '@backend/types/__generated__/client';

interface MemberRolesSelectorProps {
    roles: Role[];
    selectedRoles: string[];
    onToggleRole: (roleId: string) => void;
}

export default function MemberRolesSelector({
    roles,
    selectedRoles,
    onToggleRole,
}: MemberRolesSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-[#b5bac1] uppercase">
                Роли ({selectedRoles.length})
            </label>

            <div className="custom-scrollbar mt-2 max-h-45 space-y-1 overflow-y-auto rounded border border-[#1f2023] bg-[#1e1f22] p-2">
                {roles.map((role) => {
                    const isChecked = selectedRoles.includes(role.id);
                    return (
                        <div
                            key={role.id}
                            role="checkbox"
                            aria-checked={isChecked}
                            tabIndex={0}
                            onClick={() => onToggleRole(role.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onToggleRole(role.id);
                                }
                            }}
                            className="flex w-full cursor-pointer items-center justify-between rounded px-2 py-1.5 text-left text-sm transition-colors select-none hover:bg-[#35363c] focus:bg-[#35363c] focus:outline-none"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 shrink-0 rounded-full"
                                    style={{ backgroundColor: role.color || '#fff' }}
                                />
                                <span
                                    style={{ color: role.color || '#fff' }}
                                    className="font-medium"
                                >
                                    {role.name}
                                </span>
                            </div>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="pointer-events-none h-4 w-4 rounded border-[#4e5058] bg-[#313338] text-[#5865f2] accent-[#5865f2]"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

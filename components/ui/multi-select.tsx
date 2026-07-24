'use client';

import * as React from 'react';

import { Check, Search } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface Option {
    label: string;
    value: string;
    description?: string;
}

interface MultiSelectProps {
    options: Option[];
    selected: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    title?: string;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = 'Поиск прав...',
    title = 'ПРАВА РОЛИ',
}: MultiSelectProps) {
    const [search, setSearch] = React.useState('');

    const filteredOptions = options.filter(
        (option) =>
            option.label.toLowerCase().includes(search.toLowerCase()) ||
            option.value.toLowerCase().includes(search.toLowerCase()),
    );

    const handleToggle = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className="discord-scroll w-full max-w-2xl overflow-hidden rounded-md border border-[#1e1f22] bg-[#313338] font-sans text-[#dbdee1] select-none">
            <div className="border-b border-[#3f4147] p-5 pb-3">
                <h3 className="mb-4 text-xs font-bold tracking-wider text-[#949ba4] uppercase">
                    {title}
                </h3>

                <div className="bg-opacity-100 relative flex items-center rounded border border-transparent bg-[#1e1f22] px-2.5 py-1.5 transition-colors focus-within:border-[#5865f2]">
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent pr-7 text-sm text-[#f2f3f5] placeholder-[#949ba4] outline-none"
                    />
                    <Search className="absolute right-2.5 h-4 w-4 text-[#949ba4]" />
                </div>
            </div>

            <div className="custom-scrollbar max-h-27.5 space-y-4 overflow-y-auto p-5">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => {
                        const isSelected = selected.includes(option.value);
                        return (
                            <div
                                key={option.value}
                                onClick={() => handleToggle(option.value)}
                                className="border-opacity-40 group -mx-2 flex cursor-pointer items-center justify-between rounded border-b border-[#3f4147] px-2 py-3 transition-colors last:border-b-0 hover:bg-[#35373c]"
                            >
                                <div className="flex flex-col pr-4">
                                    <span className="text-sm font-medium text-[#f2f3f5] group-hover:text-white">
                                        {option.label}
                                    </span>
                                    <span className="mt-0.5 text-xs leading-normal text-[#949ba4]">
                                        {option.description ||
                                            `Разрешает участникам выполнять действие: ${option.value.slice(4).toLowerCase()}`}
                                    </span>
                                </div>

                                <div
                                    className={cn(
                                        'flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition-all duration-150',
                                        isSelected
                                            ? 'border-[#5865f2] bg-[#5865f2]'
                                            : 'border-[#80848e] group-hover:border-[#b5bac1]',
                                    )}
                                >
                                    <Check
                                        className={cn(
                                            'h-4 w-4 scale-0 font-bold text-white transition-transform duration-150',
                                            isSelected && 'scale-100',
                                        )}
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-8 text-center text-sm text-[#949ba4]">
                        Ничего не найдено. Попробуйте другой запрос.
                    </div>
                )}
            </div>
        </div>
    );
}

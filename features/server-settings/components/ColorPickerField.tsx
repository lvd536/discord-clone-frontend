'use client';

import { HexColorPicker } from 'react-colorful';

import { Input } from '@/components/ui/input';

import { PRESET_COLORS } from '../constants/role.constants';

interface ColorPickerFieldProps {
    value: string;
    onChange: (color: string) => void;
}

export default function ColorPickerField({ value, onChange }: ColorPickerFieldProps) {
    return (
        <div className="rounded-md bg-[#2b2d31] p-2.5 select-none sm:p-3">
            <div className="flex flex-row items-center gap-3 sm:grid sm:grid-cols-2 sm:items-start sm:gap-4">
                <div className="custom-color-picker shrink-0">
                    <HexColorPicker color={value} onChange={onChange} />
                </div>

                <div className="flex h-full min-w-0 flex-1 flex-col justify-between py-0.5 sm:gap-3">
                    <div>
                        <span className="mb-1 block text-[11px] font-semibold text-[#b5bac1] uppercase sm:text-xs">
                            HEX-код
                        </span>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div
                                className="h-7 w-7 shrink-0 rounded border border-[#1e1f22] shadow-inner sm:h-8 sm:w-8"
                                style={{ backgroundColor: value }}
                            />
                            <Input
                                maxLength={7}
                                onChange={(e) => onChange(e.target.value)}
                                value={value}
                                className="h-7 w-full border-none bg-[#1e1f22] px-2 font-mono text-[11px] text-white uppercase sm:h-8 sm:text-xs"
                            />
                        </div>
                    </div>

                    <div className="hidden sm:block">
                        <span className="mb-1.5 block text-xs font-semibold text-[#b5bac1]">
                            Популярные цвета
                        </span>
                        <div className="grid grid-cols-5 gap-1.5">
                            {PRESET_COLORS.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => onChange(preset)}
                                    className="h-6 w-6 cursor-pointer rounded-full transition-transform hover:scale-110 focus:outline-none active:scale-95"
                                    style={{ backgroundColor: preset }}
                                    title={preset}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

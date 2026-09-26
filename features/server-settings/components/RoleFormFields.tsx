'use client';

import { RolePermissions } from '@backend/types/__generated__/enums';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import * as z from 'zod';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';

import ColorPickerField from './ColorPickerField';

export const roleFormSchema = z.object({
    name: z.string().min(2, 'Минимум 2 символа'),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Неверный формат цвета'),
    permissions: z.array(z.enum(RolePermissions)),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormFieldsProps {
    register: UseFormRegister<RoleFormValues>;
    control: Control<RoleFormValues>;
}

export default function RoleFormFields({ register, control }: RoleFormFieldsProps) {
    return (
        <div className="space-y-4">
            <Field>
                <FieldLabel htmlFor="name">Название роли</FieldLabel>
                <Input
                    id="name"
                    {...register('name')}
                    placeholder="Например: Модератор"
                    className="border-none bg-[#1e1f22] text-white focus-visible:ring-1 focus-visible:ring-[#5865f2]"
                />
            </Field>

            <Controller
                name="color"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="color">Цвет роли</FieldLabel>
                        <ColorPickerField value={field.value} onChange={field.onChange} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="permissions"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Права доступа</FieldLabel>
                        <MultiSelect
                            onChange={field.onChange}
                            selected={field.value}
                            options={Object.values(RolePermissions).map((permission) => ({
                                label: permission,
                                value: permission,
                            }))}
                        />
                    </Field>
                )}
            />
        </div>
    );
}

'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { getErrorMessage } from '@/lib/errors';

interface UseEditableFieldOptions {
    initialValue: string;
    validate?: (val: string) => string | null;
    onSave: (val: string) => Promise<void>;
    successMessage?: string;
}

export function useEditableField({
    initialValue,
    validate,
    onSave,
    successMessage = 'Успешно обновлено!',
}: UseEditableFieldOptions) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const [isSaving, setIsSaving] = useState(false);

    const startEdit = () => {
        setValue(initialValue);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setValue(initialValue);
        setIsEditing(false);
    };

    const save = async () => {
        const trimmed = value.trim();

        if (trimmed === initialValue.trim()) {
            setIsEditing(false);
            return;
        }

        if (validate) {
            const validationError = validate(trimmed);
            if (validationError) {
                toast.error(validationError);
                return;
            }
        }

        setIsSaving(true);
        try {
            await onSave(trimmed);
            toast.success(successMessage);
            setIsEditing(false);
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setIsSaving(false);
        }
    };

    return {
        isEditing,
        value,
        setValue,
        isSaving,
        startEdit,
        cancelEdit,
        save,
    };
}

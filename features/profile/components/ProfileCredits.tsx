'use client';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { api } from '@/lib/api/api';

import { useEditableField } from '../hooks/useEditableField';
import ProfileEditableRow from './ProfileEditableRow';
import ProfileVerificationRow from './ProfileVerificationRow';

export default function ProfileCredits() {
    const { profile, refetchUser } = useAuthStore();

    const usernameField = useEditableField({
        initialValue: profile?.displayName || '',
        validate: (val) => {
            if (!val) return 'Имя не может быть пустым';
            if (val.length < 3) return 'Имя должно содержать минимум 3 символа';
            return null;
        },
        onSave: async (displayName) => {
            await api.patch('/users/profile', { displayName });
            await refetchUser();
        },
        successMessage: 'Отображаемое имя успешно обновлено!',
    });

    const emailField = useEditableField({
        initialValue: profile?.email || '',
        validate: (val) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!val || !emailRegex.test(val)) return 'Введите корректный адрес электронной почты';
            return null;
        },
        onSave: async (email) => {
            await api.patch('/users/profile', { email: email.toLowerCase() });
            await refetchUser();
        },
        successMessage: 'Почта успешно обновлена! Потребуется повторная верификация.',
    });

    if (!profile) return null;

    return (
        <div className="mx-2 mt-4 space-y-4 rounded-lg bg-[#2b2d31] p-4 select-none sm:mx-6">
            <ProfileEditableRow
                label="Отображаемое имя"
                displayValue={profile.displayName}
                placeholder="Введите новое имя..."
                isEditing={usernameField.isEditing}
                editValue={usernameField.value}
                isSaving={usernameField.isSaving}
                onChange={usernameField.setValue}
                onStartEdit={usernameField.startEdit}
                onCancel={usernameField.cancelEdit}
                onSave={usernameField.save}
            />

            <ProfileEditableRow
                label="Электронная почта"
                displayValue={profile.email}
                type="email"
                placeholder="new-email@example.com"
                isEditing={emailField.isEditing}
                editValue={emailField.value}
                isSaving={emailField.isSaving}
                onChange={emailField.setValue}
                onStartEdit={emailField.startEdit}
                onCancel={emailField.cancelEdit}
                onSave={emailField.save}
            />

            <ProfileVerificationRow isVerified={profile.isVerified} />
        </div>
    );
}

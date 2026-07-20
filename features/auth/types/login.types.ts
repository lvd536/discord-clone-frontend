import { User } from '@backend/types/__generated__/client';

export type LoginFormDataType = {
    email: string;
    password: string;
};

export interface RegisterFormDataType extends LoginFormDataType {
    displayName: string;
}

export type AuthResponseType = {
    user: User;
    access_token: string;
};

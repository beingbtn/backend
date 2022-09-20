import { type APIUser } from 'discord-api-types/v10';

export type User = Omit<APIUser, 'locale' | 'mfa_enabled'>;
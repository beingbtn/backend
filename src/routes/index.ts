import { type ENV } from '../@types/ENV';
import { type Route } from '../structures/Route';
import { MemberRoute } from './member';
import { MembersRoute } from './members';

export const routes = {
    '/member': MemberRoute,
    '/members': MembersRoute,
} as {
    '/member': new (env: ENV) => MemberRoute,
    '/members': new (env: ENV) => MembersRoute,
    [key: string]: (new (env: ENV) => Route) | undefined,
};
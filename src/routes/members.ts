import { type ENV } from '../@types/ENV';
import { Route } from '../structures/Route';

export class MembersRoute extends Route {
    public constructor(env: ENV) {
        super(env);
    }

    public async get(_request: Request, baseHeaders: HeadersInit) {
        const users = await this.env.users.get('users');

        return new Response(users, {
            headers: {
                ...baseHeaders,
                'Content-Type': 'application/json',
            },
            status: 200,
        });
    }
}
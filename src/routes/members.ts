import { type APIUser } from 'discord-api-types/v10';
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

    public async put(request: Request, baseHeaders: HeadersInit) {
        const authorization = request.headers.get('Authorization');

        const fragments = authorization?.split(' ') ?? [];

        if (fragments[0] !== 'Basic' || fragments[1] !== this.env.BRIDGE_AUTHORIZATION) {
            return new Response(null, {
                headers: baseHeaders,
                status: 404,
            });
        }

        const rawAPIUsers = await request.json() as Partial<APIUser>[];

        const rawUsers = rawAPIUsers.map((rawUser) => ({
            id: rawUser.id ?? null,
            username: rawUser.username ?? null,
            avatar: rawUser.avatar ?? null,
            discriminator: rawUser.discriminator ?? null,
            public_flags: rawUser.public_flags ?? null,
            flags: rawUser.flags ?? null,
            banner: rawUser.banner ?? null,
            accent_color: rawUser.accent_color ?? null,
        }));

        // eslint-disable-next-line no-restricted-syntax
        for (const rawUser of rawUsers) {
            if (
                rawUser.id === null
                || rawUser.username === null
                || rawUser.discriminator === null
            ) {
                return new Response('Missing id, username, or discriminator', {
                    headers: baseHeaders,
                    status: 400,
                });
            }
        }

        const users = rawUsers.sort(
            (userA, userB) => userA.username!.localeCompare(userB.username!),
        );

        await this.env.users.put('users', JSON.stringify(users));

        return new Response(null, {
            headers: baseHeaders,
            status: 200,
        });
    }
}
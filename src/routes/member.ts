import { type ENV } from '../@types/ENV';
import { User } from '../@types/User';
import { Route } from '../structures/Route';

export class MemberRoute extends Route {
    public constructor(env: ENV) {
        super(env);
    }

    public async post(request: Request, baseHeaders: HeadersInit) {
        const authorization = request.headers.get('Authorization');

        const fragments = authorization?.split(' ') ?? [];

        if (fragments[0] !== 'Basic' || fragments[1] !== this.env.BRIDGE_AUTHORIZATION) {
            return new Response(null, {
                headers: baseHeaders,
                status: 404,
            });
        }

        const rawUser = await request.json() as Partial<User>;

        const user = {
            id: rawUser.id ?? null,
            username: rawUser.username ?? null,
            avatar: rawUser.avatar ?? null,
            discriminator: rawUser.discriminator ?? null,
            public_flags: rawUser.public_flags ?? null,
            flags: rawUser.flags ?? null,
            banner: rawUser.banner ?? null,
            accent_color: rawUser.accent_color ?? null,
        } as User;

        if (
            user.id === null
            || user.username === null
            || user.discriminator === null
        ) {
            return new Response('Missing id, username, or discriminator', {
                headers: baseHeaders,
                status: 400,
            });
        }

        const usersString = await this.env.users.get('users') as string;

        const users = JSON.parse(usersString) as User[];

        users.push(user);

        users.sort(
            (userA, userB) => userA.username.localeCompare(userB.username),
        );

        await this.env.users.put('users', JSON.stringify(users));

        return new Response(null, {
            headers: baseHeaders,
            status: 200,
        });
    }

    public async delete(request: Request, baseHeaders: HeadersInit) {
        const authorization = request.headers.get('Authorization');

        const fragments = authorization?.split(' ') ?? [];

        if (fragments[0] !== 'Basic' || fragments[1] !== this.env.BRIDGE_AUTHORIZATION) {
            return new Response(null, {
                headers: baseHeaders,
                status: 404,
            });
        }

        const userId = await request.text();

        if (userId === null) {
            return new Response('Missing userId', {
                headers: baseHeaders,
                status: 400,
            });
        }

        const usersString = await this.env.users.get('users') as string;

        const users = JSON.parse(usersString) as User[];

        const index = users.findIndex((user) => user.id === userId);

        if (index >= 0) {
            users.splice(index, 1);
        }

        await this.env.users.put('users', JSON.stringify(users));

        return new Response(null, {
            headers: baseHeaders,
            status: 200,
        });
    }
}
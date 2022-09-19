import { type RESTGetAPIUserResult } from 'discord-api-types/v10';
import { type ENV } from '../@types/ENV';
import { Route } from '../structures/Route';

export class MemberRoute extends Route {
    public constructor(env: ENV) {
        super(env);
    }

    public async post(request: Request, baseHeaders: HeadersInit) {
        const { searchParams } = new URL(request.url);

        const accessToken = searchParams.get('access_token');
        const tokenType = searchParams.get('token_type');

        if (accessToken === null || tokenType === null) {
            return new Response(null, {
                headers: baseHeaders,
                status: 400,
            });
        }

        const userRequest = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${tokenType} ${accessToken}`,
            },
        });

        if (userRequest.ok === false) {
            return new Response(null, {
                headers: baseHeaders,
                status: 418,
            });
        }

        const rawUser = (await userRequest.json()) as RESTGetAPIUserResult;

        const cleanUser = {
            id: rawUser.id,
            username: rawUser.username,
            avatar: rawUser.avatar,
            discriminator: rawUser.discriminator,
            public_flags: rawUser.public_flags,
            flags: rawUser.flags,
            banner: rawUser.banner,
            accent_color: rawUser.accent_color,
        };

        const userName = `user-${cleanUser.id}`;

        const userIds = await this.env.users.list({ prefix: 'user-' });

        await this.env.users.put(userName, JSON.stringify(cleanUser));

        const users = [
            cleanUser,
            ...(await Promise.all(
                userIds.keys.map(async (key) => {
                    if (key.name === userName) {
                        return null;
                    }

                    const string = await this.env.users.get(key.name);
                    return JSON.parse(string!) as RESTGetAPIUserResult | null;
                }),
            )),
        ].filter((user) => user !== null).sort();

        await this.env.users.put('users', JSON.stringify(users));

        return new Response(null, {
            headers: baseHeaders,
            status: 200,
        });
    }
}
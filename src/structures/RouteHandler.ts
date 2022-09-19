import { ENV } from '../@types/ENV';
import { type Route } from './Route';
import { routes } from '../routes';

export class RouteHandler {
    public readonly baseHeaders: HeadersInit;

    public readonly env: ENV;

    public constructor(baseHeaders: HeadersInit, env: ENV) {
        this.baseHeaders = baseHeaders;
        this.env = env;
    }

    public async handle(request: Request) {
        const { pathname } = new URL(request.url);

        const Route = routes[pathname];

        if (typeof Route === 'undefined') {
            return new Response(null, {
                status: 404,
            });
        }

        const route = new Route(this.env);

        // @ts-ignore
        const method = route[request.method.toLowerCase()] as
            | Route['get']
            | Route['head']
            | Route['post']
            | Route['put']
            | Route['delete']
            | Route['connect']
            | Route['options']
            | Route['trace']
            | Route['patch'];

        if (method) {
            return method(request, this.baseHeaders);
        }

        switch (request.method) {
            case 'OPTIONS': {
                const { headers } = request;

                if (
                    headers.get('Origin') !== null
                    && headers.get('Access-Control-Request-Method') !== null
                    && headers.get('Access-Control-Request-Headers') !== null
                ) {
                    const respHeaders = {
                        ...this.baseHeaders,
                        'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
                        'Access-Control-Max-Age': '86400',
                        'Access-Control-Allow-Headers': request.headers.get(
                            'Access-Control-Request-Headers',
                        )!,
                    };

                    return new Response(null, {
                        headers: respHeaders,
                    });
                }

                return new Response(null, {
                    headers: {
                        Allow: 'GET, HEAD, POST, OPTIONS',
                    },
                });
            }
            default: {
                return new Response(null, {
                    status: 405,
                });
            }
        }
    }
}
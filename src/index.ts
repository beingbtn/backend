import { type ENV } from './@types/ENV';
import { RouteHandler } from './structures/RouteHandler';
import { Constants } from './util/Constants';

let routeHandler: RouteHandler;

export default {
    fetch: async (request: Request, env: ENV) => {
        const origin = request.headers.get('Origin');

        const baseHeaders = Constants.baseHeaders(origin);

        routeHandler ??= new RouteHandler(baseHeaders, env);

        return routeHandler.handle(request);
    },
};
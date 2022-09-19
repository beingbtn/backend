import { type ENV } from '../@types/ENV';

export class Route {
    public readonly env: ENV;

    public constructor(env: ENV) {
        this.env = env;

        this.get = this.get?.bind(this);
        this.head = this.head?.bind(this);
        this.post = this.post?.bind(this);
        this.put = this.put?.bind(this);
        this.delete = this.delete?.bind(this);
        this.connect = this.connect?.bind(this);
        this.trace = this.trace?.bind(this);
        this.patch = this.patch?.bind(this);
    }

    public get?(request: Request, baseHeaders: HeadersInit): Promise<Response>;

    public head?(request: Request, baseHeaders: HeadersInit): Promise<Response>;

    public post?(request: Request, baseHeaders: HeadersInit): Promise<Response>;

    public put?(request: Request, baseHeaders: HeadersInit): Promise<Response>;

    public delete?(request: Request, baseHeaders: HeadersInit): Promise<Response>;

    public connect?(request: Request, baseHeaders: HeadersInit): Promise<Response>;

    public options?(request: Request, baseHeaders: HeadersInit): Promise<Response>;

    public trace?(request: Request, baseHeaders: HeadersInit): Promise<Response>;

    public patch?(request: Request, baseHeaders: HeadersInit): Promise<Response>;
}
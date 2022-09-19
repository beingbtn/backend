export class Constants {
    public static baseHeaders = (origin: string | null) => (
        origin && this.origins.includes(origin)
            ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
            : {} as HeadersInit
    );

    public static origins = [
        'https://btn.attituding.live',
        'https://btn.attituding.workers.dev',
        'http://localhost:3000',
    ];
}
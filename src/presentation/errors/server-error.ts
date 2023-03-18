export class ServerError extends Error {
    constructor(stack: string) {
        super('Internal server error');
        this.message = 'ServerError';
        this.stack = stack;
    }
}

declare module 'dotenvy' {
    interface Options {
        path?: string;
        encoding?: string;
        comment?: string;
        sigil?: string;
        separator?: string;
        quote?: string;
    }

    type OptionalOptions = Options | string | undefined | null;

    export default function dotenvy (options?: OptionalOptions): NodeJS.ProcessEnv;
    export default function dotenvy (options: OptionalOptions, callback: (error: Error, env: NodeJS.ProcessEnv) => void): void;
}

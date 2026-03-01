let internalConsole: Console = globalThis.console;

export const setConsole = (c: Console) => {
    internalConsole = c;
};

export const logger = {
    info: (...args: any[]) => internalConsole.log(...args),
    warn: (...args: any[]) => internalConsole.warn(...args),
    error: (...args: any[]) => internalConsole.error(...args),
    debug: (...args: any[]) => internalConsole.debug(...args),
    log: (...args: any[]) => internalConsole.log(...args),
};

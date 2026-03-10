export type Msg<T = undefined> = {
    message: string;
    data: T;
};

export type ErrMsg = {
    message: string;
    error: string;
    data?: any;
};

export type GenericMsg<T> = Msg<T> | ErrMsg;

export type LatexRenderError = {
    error: {
        line: number;
        message: string;
    };
    success: boolean;
};

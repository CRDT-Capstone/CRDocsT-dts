export type Msg<T = undefined> = {
    message: string;
    data: T;
};

export type ErrMsg = {
    message: string;
    error: string;
};

export type GenericMsg<T> = Msg<T> | ErrMsg;

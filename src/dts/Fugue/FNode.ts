import { Operation } from "../../types";

export class FListNode<P> {
    value?: string;
    position: P;

    constructor(position: P, value?: string) {
        this.value = value;
        this.position = position;
    }
}

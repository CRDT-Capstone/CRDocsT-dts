import { Operation } from "../../types";

export class FListNode<P> {
    value?: string;
    operation?: Operation;
    position: P;

    constructor(position: P, value?: string, operation?: Operation) {
        this.value = value;
        this.position = position;
    }
}

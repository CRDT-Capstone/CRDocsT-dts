import { Operation } from "../../types";

export class FNode<P> {
    value?: string;
    operation?: Operation;
    position: P;

    constructor(position: P, value?: string, operation?: Operation) {
        this.value = value;
        this.position = position;
    }
}

import { AstNode } from "../../types/index.js";

export enum ActionType {
    DELETE,
    INSERT,
    MOVE,
    UPDATE,
    TREE_DELETE,
    TREE_INSERT,
}

export type OperationType = "ADD" | "DELETE" | "MOVE" | "UPDATE";
export type OperationPart = "INSERT" | "DELETE";

export abstract class Action<T extends ActionType = ActionType> {
    type: T;
    node: AstNode;
    constructor(node: AstNode, type: T) {
        this.node = node;
        this.type = type;
    }

    equals(other: Object): boolean {
        return other instanceof Action && this.type === other.type && this.node.id === other.node.id;
    }
}

export type Actions = Action[];

export abstract class Addition<T extends ActionType> extends Action<T> {
    parent: AstNode;
    pos: number;
    constructor(node: AstNode, parent: AstNode, pos: number, type: T) {
        super(node, type);
        this.parent = parent;
        this.pos = pos;
    }
}

export class Delete extends Action<ActionType.DELETE> {
    constructor(public node: AstNode) {
        super(node, ActionType.DELETE);
    }
}

export class Insert extends Addition<ActionType.INSERT> {
    constructor(
        public node: AstNode,
        public parent: AstNode,
        public pos: number,
    ) {
        super(node, parent, pos, ActionType.INSERT);
    }

    equals(other: object): boolean {
        return (
            super.equals(other) &&
            other instanceof Addition &&
            this.parent.id === other.parent.id &&
            this.pos === other.pos
        );
    }
}

export abstract class TreeAction<T extends ActionType> extends Action<T> {
    constructor(node: AstNode, type: T) {
        super(node, type);
    }
}

export abstract class TreeAddition<T extends ActionType> extends TreeAction<T> {
    constructor(
        public node: AstNode,
        public parent: AstNode,
        public pos: number,
        type: T,
    ) {
        super(node, type);
    }

    equals(other: Object): boolean {
        return (
            other instanceof TreeAddition &&
            this.type === other.type &&
            this.node.id === other.node.id &&
            this.parent.id === other.parent.id &&
            this.pos === other.pos
        );
    }
}

export class Move extends TreeAddition<ActionType.MOVE> {
    constructor(
        public node: AstNode,
        public parent: AstNode,
        public pos: number,
    ) {
        super(node, parent, pos, ActionType.MOVE);
    }
}

export class TreeDelete extends TreeAction<ActionType.TREE_DELETE> {
    constructor(public node: AstNode) {
        super(node, ActionType.TREE_DELETE);
    }
}

export class TreeInsert extends TreeAddition<ActionType.TREE_INSERT> {
    constructor(
        public node: AstNode,
        public parent: AstNode,
        public pos: number,
    ) {
        super(node, parent, pos, ActionType.TREE_INSERT);
    }
}

export class Update extends Action<ActionType.UPDATE> {
    constructor(
        public node: AstNode,
        public value: string | string[],
    ) {
        super(node, ActionType.UPDATE);
    }

    equals(other: Object): boolean {
        return super.equals(other) && other instanceof Update && this.value === other.value;
    }
}

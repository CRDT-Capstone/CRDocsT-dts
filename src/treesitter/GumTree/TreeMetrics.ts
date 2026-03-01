export class TreeMetrics {
    /**
     * The number of nodes in the subtree rooted at the node.
     */
    readonly size: number;

    /**
     * The size of the longer branch in the subtree rooted at the node.
     */
    readonly height: number;

    /**
     * The hashcode of the subtree rooted at the node.
     */
    readonly hash: number;

    /**
     * The hashcode of the subtree rooted at the node, excluding labels.
     */
    readonly structureHash: number;

    /**
     * The number of ancestors of a node.
     */
    readonly depth: number;

    /**
     * An absolute position for the node. Usually computed via the postfix order.
     */
    readonly position: number;

    constructor(size: number, height: number, hash: number, structureHash: number, depth: number, position: number) {
        this.size = size;
        this.height = height;
        this.hash = hash;
        this.structureHash = structureHash;
        this.depth = depth;
        this.position = position;
    }
}


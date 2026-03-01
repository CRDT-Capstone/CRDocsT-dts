import { ID } from "../../../dts/index.js";
import { NodeId } from "../../types/AST.js";

/**
 * An Anchor represents the position of an AST node in the FugueTree.
 * It consists of a startId, which is the ID of the first node in the subtree,
 * and a length, which indicates how many nodes are in the subtree.
 */
export interface Anchor {
    startId: ID;
    length: number;
}

/**
 * The Registry class maintains a mapping from NodeId to Anchor,
 * allowing constant time retrieval of an AST node's position in the FugueTree.
 */
export class Registry {
    // NodeId -> Anchor
    // Maps AstNode to its position in the FugueTree
    private anchors: Map<NodeId, Anchor> = new Map();

    register(key: NodeId, anchor: Anchor): void {
        this.anchors.set(key, anchor);
    }

    get(key: NodeId): Anchor | undefined {
        return this.anchors.get(key);
    }

    has(key: NodeId): boolean {
        return this.anchors.has(key);
    }

    update(key: NodeId, patch: Partial<Anchor>): void {
        const existing = this.anchors.get(key);
        if (!existing) {
            throw new Error(`No anchor found for key: ${key}`);
        }
        this.anchors.set(key, { ...existing, ...patch });
    }

    delete(key: NodeId): void {
        this.anchors.delete(key);
    }

    clear() {
        this.anchors.clear();
    }
}

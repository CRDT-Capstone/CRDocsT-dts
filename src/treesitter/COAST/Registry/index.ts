import { FNode, FTree, ID } from "../../../dts/index.js";
import { BragiAST, NodeId } from "../../types/AST.js";

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

    save(): Map<NodeId, Anchor> {
        return new Map(this.anchors);
    }

    load(saved: Map<NodeId, Anchor>): void {
        this.anchors = new Map(saved);
    }

    clear() {
        this.anchors.clear();
    }

    populate(ast: BragiAST, tree: FTree): void {
        const visibleIds: ID[] = [];
        for (const node of tree.traverseNodes(tree.root)) {
            visibleIds.push(node.id);
        }

        for (const [nodeId, astNode] of ast.nodes) {
            const startId = visibleIds[astNode.startIndex] ?? { sender: "", counter: 0 };
            this.register(nodeId, {
                startId,
                length: astNode.endIndex - astNode.startIndex,
            });
        }
    }
}

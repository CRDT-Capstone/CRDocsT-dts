import { allChildIds, type BragiAST, type NodeId } from "./AST.js";

export class Mapping {
    constructor(
        public readonly f: NodeId, // src node id
        public readonly s: NodeId, // dst node id
    ) {}
}

/**
 * Bidirectional map of matched node pairs between two ASTs, i.e. oldAstNode <-> newAstNode
 * the keys and values are the node ids of the old and new ASTs respectively
 * Unmapped oldAstNodes are assumed to be deleted
 * Unmapped newAstNodes are assumed to be inserted
 * Mapped nodes with different text are assumed to be updated
 * Mapped nodes in different positions are assumed to be moved
 */
export class MappingStore implements Iterable<Mapping> {
    readonly oldAst: BragiAST;
    readonly newAst: BragiAST;

    private srcToDst: Map<NodeId, NodeId> = new Map();
    private dstToSrc: Map<NodeId, NodeId> = new Map();

    constructor(src: BragiAST, dst: BragiAST);
    constructor(ms: MappingStore);
    constructor(srcOrMs: BragiAST | MappingStore, dst?: BragiAST) {
        if (srcOrMs instanceof MappingStore) {
            this.oldAst = srcOrMs.oldAst;
            this.newAst = srcOrMs.newAst;
            for (const m of srcOrMs) this.addMapping(m.f, m.s);
        } else {
            this.oldAst = srcOrMs;
            this.newAst = dst!;
        }
    }

    addMapping(srcId: NodeId, dstId: NodeId): void {
        this.srcToDst.set(srcId, dstId);
        this.dstToSrc.set(dstId, srcId);
    }

    addMappingRecursively(srcId: NodeId, dstId: NodeId): void {
        this.addMapping(srcId, dstId);
        const srcNode = this.oldAst.nodes.get(srcId)!;
        const dstNode = this.newAst.nodes.get(dstId)!;
        const srcChildren = allChildIds(this.oldAst, srcNode);
        const dstChildren = allChildIds(this.newAst, dstNode);
        for (let i = 0; i < srcChildren.length; i++) this.addMappingRecursively(srcChildren[i], dstChildren[i]);
    }

    removeMapping(srcId: NodeId, dstId: NodeId): void {
        this.srcToDst.delete(srcId);
        this.dstToSrc.delete(dstId);
    }

    getDstForSrc(srcId: NodeId): NodeId | undefined {
        return this.srcToDst.get(srcId);
    }

    getSrcForDst(dstId: NodeId): NodeId | undefined {
        return this.dstToSrc.get(dstId);
    }

    isSrcMapped(srcId: NodeId): boolean {
        return this.srcToDst.has(srcId);
    }

    isDstMapped(dstId: NodeId): boolean {
        return this.dstToSrc.has(dstId);
    }

    has(srcId: NodeId, dstId: NodeId): boolean {
        return this.srcToDst.get(srcId) === dstId;
    }

    size(): number {
        return this.srcToDst.size;
    }

    areBothUnmapped(srcId: NodeId, dstId: NodeId): boolean {
        return !this.isSrcMapped(srcId) && !this.isDstMapped(dstId);
    }

    areSrcsUnmapped(srcIds: NodeId[]): boolean {
        return srcIds.every((id) => !this.isSrcMapped(id));
    }

    areDstsUnmapped(dstIds: NodeId[]): boolean {
        return dstIds.every((id) => !this.isDstMapped(id));
    }

    hasUnmappedSrcChildren(srcId: NodeId): boolean {
        return this.getDescendants(srcId, this.oldAst).some((id) => !this.isSrcMapped(id));
    }

    hasUnmappedDstChildren(dstId: NodeId): boolean {
        return this.getDescendants(dstId, this.newAst).some((id) => !this.isDstMapped(id));
    }

    isMappingAllowed(srcId: NodeId, dstId: NodeId): boolean {
        const srcNode = this.oldAst.nodes.get(srcId)!;
        const dstNode = this.newAst.nodes.get(dstId)!;
        return srcNode.type === dstNode.type && this.areBothUnmapped(srcId, dstId);
    }

    private getDescendants(nodeId: NodeId, ast: BragiAST): NodeId[] {
        const node = ast.nodes.get(nodeId)!;
        const result: NodeId[] = [];
        const children = allChildIds(ast, node);
        const stack = [...children];
        while (stack.length > 0) {
            const id = stack.pop()!;
            result.push(id);
            const child = ast.nodes.get(id)!;
            const grandChildren = allChildIds(ast, child);
            stack.push(...grandChildren);
        }
        return result;
    }

    [Symbol.iterator](): Iterator<Mapping> {
        const entries = this.srcToDst.entries();
        return {
            next(): IteratorResult<Mapping> {
                const { value, done } = entries.next();
                if (done) return { value: undefined as any, done: true };
                return { value: new Mapping(value[0], value[1]), done: false };
            },
        };
    }
}

import { Tree } from "web-tree-sitter";
import { allChildIds, AstNode, BragiAST, NodeId } from "./types/index.js";
import { Mapping, MappingStore } from "./types/GumTree.js";
import { diceSimilarity, getDescendants, getParent } from "./GumTree/utils.js";
import { postorderAstTraversal } from "./utils.js";
import { TreeMetricComputer } from "./GumTree/TreeMetricComputer.js";
import { TreeMetrics } from "./GumTree/TreeMetrics.js";
import { ZsMatcher } from "./GumTree/ZsMatcher.js";

export class GumTreeBottomUp {
    readonly DEFAULT_SIZE_THRESHOLD = 1000;
    readonly DEFAULT_SIM_THRESHOLD = 0.5;

    protected sizeThreshold = this.DEFAULT_SIZE_THRESHOLD;
    protected simThreshold = this.DEFAULT_SIM_THRESHOLD;

    private srcTree: BragiAST;
    private dstTree: BragiAST;
    private srcMetrics: Map<NodeId, TreeMetrics>;
    private dstMetrics: Map<NodeId, TreeMetrics>;

    constructor(
        srcTree: BragiAST,
        dstTree: BragiAST,
        srcMetricsComputer: TreeMetricComputer,
        dstMetricsComputer: TreeMetricComputer,
    ) {
        this.srcTree = srcTree;
        this.dstTree = dstTree;
        this.srcMetrics = srcMetricsComputer.getMetrics();
        this.dstMetrics = dstMetricsComputer.getMetrics();
    }

    match(srcNode: AstNode, dstNode: AstNode, mappings: MappingStore) {
        const postOrder: AstNode[] = [];
        postorderAstTraversal(this.srcTree, (node) => {
            postOrder.push(node);
        });
        for (const node of postOrder) {
            const children = allChildIds(this.srcTree, node);
            if (node.parentId === null) {
                //if you're the root
                mappings.addMapping(node.id, dstNode.id);
                this.lastChanceMatch(mappings, node, dstNode);
                break;
            } else if (!(mappings.isSrcMapped(node.id) || children.length === 0)) {
                const candidates = this.getDstCandidates(mappings, node);
                let best: AstNode | null = null;
                let max = -1;
                for (const cand of candidates) {
                    const candNode = this.dstTree.nodes.get(cand)!;
                    const sim = diceSimilarity(node, candNode, mappings);
                    if (sim > max && sim >= this.simThreshold) {
                        max = sim;
                        best = candNode;
                    }
                }
                if (best !== null) {
                    this.lastChanceMatch(mappings, node, best);
                    mappings.addMapping(node.id, best.id);
                }
            }
        }
        return mappings;
    }

    getDstCandidates(mappings: MappingStore, srcNode: AstNode) {
        const seeds: NodeId[] = [];
        for (const node of getDescendants(srcNode.id, mappings.oldAst)) {
            if (mappings.isSrcMapped(node.id))
                if (mappings.getDstForSrc(node.id)) seeds.push(mappings.getDstForSrc(node.id)!);
        }
        const candidates: NodeId[] = [];
        const visited: Set<NodeId> = new Set();
        for (let seed of seeds) {
            while (getParent(seed, mappings.newAst) !== undefined) {
                const parent = getParent(seed, mappings.newAst);
                if (parent && visited.has(parent.id)) break;
                visited.add(parent!.id);
                if (parent!.type === srcNode.type && !(mappings.isDstMapped(parent!.id) || parent!.parentId === null))
                    candidates.push(parent!.id);
                seed = parent!.id;
            }
        }

        return candidates;
    }

    lastChanceMatch(mappings: MappingStore, srcNode: AstNode, dstNode: AstNode) {
        if (
            this.srcMetrics.get(srcNode.id)!.size < this.sizeThreshold ||
            this.dstMetrics.get(dstNode.id)!.size < this.sizeThreshold
        ) {
            const zsMappings = new MappingStore(this.srcTree, this.dstTree);
            const srcMetricComputer = new TreeMetricComputer();
            const dstMetricComputer = new TreeMetricComputer();
            srcMetricComputer.buildMetrics(this.srcTree, srcNode);
            dstMetricComputer.buildMetrics(this.dstTree, dstNode);
            const m = new ZsMatcher(this.srcTree, this.dstTree, zsMappings, srcMetricComputer, dstMetricComputer);
            m.match();
            for (const mapping of zsMappings) {
                if (mappings.isMappingAllowed(mapping.f, mapping.s)) mappings.addMapping(mapping.f, mapping.s);
            }
        }
    }
}

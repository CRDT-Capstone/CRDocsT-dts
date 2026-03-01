import { BragiAST, AstNode } from "../../AST";
import { Mapping } from "../GumTree";


export class TextualPositionDistanceMappingComparator {
    private srcTree: BragiAST;
    private dstTree: BragiAST;

    constructor(srcTree: BragiAST, dstTree: BragiAST) {
        this.srcTree = srcTree;
        this.dstTree = dstTree;
    }

    compare(m1: Mapping, m2: Mapping): number {
        
        

        const m1PosDist = this.textualPositionDistance(this.srcTree.nodes.get(m1.f)!, this.dstTree.nodes.get(m1.s)!);
        const m2PosDist = this.textualPositionDistance(this.srcTree.nodes.get(m2.f)!, this.dstTree.nodes.get(m2.s)!);
        return m1PosDist - m2PosDist;
    }

    private textualPositionDistance(src: AstNode, dst: AstNode): number {
        return Math.abs(src.startIndex - dst.startIndex) + Math.abs(src.endIndex - dst.endIndex);
    }
}
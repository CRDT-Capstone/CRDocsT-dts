import { int } from "zod";
import { AbsolutePositionDistanceMappingComparator } from "./AbsolutePositionDistanceMappingComparator";
import { ParentsSimilarityMappingComparator } from "./ParentsSimilarityMappingComparator";
import { SiblingsSimilarityMappingComparator } from "./SiblingsSimilarityMappingComparator";
import { TextualPositionDistanceMappingComparator } from "./TexttualPositionDistanceMappingComparator";
import { PositionInParentsSimilarityMappingComparator } from "./PositionInParentsSimilarityMappingComparator";
import { Mapping, MappingStore } from "./GumTree";
import { BragiAST } from "../AST";
import { TreeMetricComputer } from "./TreeMetricComputer";

export class FullMappingComparator {
        private siblingsComparator: SiblingsSimilarityMappingComparator;
        private parentsComparator: ParentsSimilarityMappingComparator;
        private parentsPositionComparator: PositionInParentsSimilarityMappingComparator;
        private textualPositionComparator: TextualPositionDistanceMappingComparator;
        private positionComparator: AbsolutePositionDistanceMappingComparator;

        constructor(ms: MappingStore, srcTree: BragiAST, dstTree: BragiAST, srcMetricComputer: TreeMetricComputer, dstMetricComputer: TreeMetricComputer) {
            this.siblingsComparator = new SiblingsSimilarityMappingComparator(ms, srcTree, dstTree);
            this.parentsComparator = new ParentsSimilarityMappingComparator(srcTree, dstTree);
            this.parentsPositionComparator = new PositionInParentsSimilarityMappingComparator(srcTree, dstTree);
            this.textualPositionComparator = new TextualPositionDistanceMappingComparator(srcTree, dstTree);
            this.positionComparator = new AbsolutePositionDistanceMappingComparator(srcTree, dstTree, srcMetricComputer, dstMetricComputer);
        }

         compare(m1: Mapping, m2: Mapping) {
            // compare with matched siblings similarity
            let result: number = this.siblingsComparator.compare(m1, m2);
            if (result !== 0)
                return result;

            // compare with ancestors similarity
            result = this.parentsComparator.compare(m1, m2);
            if (result !== 0)
                return result;

            // compare with relative position similarity
            result = this.parentsPositionComparator.compare(m1, m2);
            if (result !== 0)
                return result;

            // compare with relative pos
            result = this.textualPositionComparator.compare(m1, m2);
            if (result !== 0)
                return result;

            // compare with absolute pos
            return this.positionComparator.compare(m1, m2);
        }
    }

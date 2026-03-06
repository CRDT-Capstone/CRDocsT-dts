import { logger } from "../utils/logging.js";
import { EditScriptGen, SimplifiedChawatheScriptGen } from "./Actions/index.js";
import { TreeMetricComputer } from "./GumTree/index.js";
import { GumTreeBottomUp } from "./GumTreeBottomUp.js";
import { GumTreeTopDown } from "./GumTreeTopDown.js";
import { BragiAST } from "./types/index.js";

export class CompositeMatcher {
    private editScriptGen: EditScriptGen;
    private oldAstMetricsComp: TreeMetricComputer = new TreeMetricComputer();
    private newAstMetricsComp: TreeMetricComputer = new TreeMetricComputer();

    constructor(editScriptGen: EditScriptGen = new SimplifiedChawatheScriptGen()) {
        this.editScriptGen = editScriptGen;
    }

    match(oldAst: BragiAST, newAst: BragiAST) {
        this.oldAstMetricsComp.buildMetrics(oldAst, oldAst.nodes.get(oldAst.rootId)!);
        this.newAstMetricsComp.buildMetrics(newAst, newAst.nodes.get(newAst.rootId)!);
        logger.debug("AST metrics", {
            oldAstMetricsComp: this.oldAstMetricsComp,
            newAstMetricsComp: this.newAstMetricsComp,
        });

        const topDown = new GumTreeTopDown(oldAst, newAst);
        const bottomUp = new GumTreeBottomUp(oldAst, newAst, this.oldAstMetricsComp, this.newAstMetricsComp);
        let mappings = topDown.topDown();
        mappings = bottomUp.match(oldAst.nodes.get(oldAst.rootId)!, newAst.nodes.get(newAst.rootId)!, mappings);
        logger.debug("Mappings", { mappings });

        const editScript = this.editScriptGen.computeActions(mappings);
        logger.debug("Edit script", { editScript });
        return editScript;
    }
}

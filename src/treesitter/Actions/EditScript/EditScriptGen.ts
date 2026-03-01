import { BragiAST } from "../../types/AST.js";
import { MappingStore } from "../../types/GumTree.js";
import { Action, Actions, ActionType } from "../Model/index.js";

export type EditScript = Actions;

export function lastIndexOf(script: EditScript, action: Action): number {
    for (let i = script.length - 1; i >= 0; i--) {
        if (script[i].equals(action)) return i;
    }
    return -1;
}

export interface EditScriptGen {
    computeActions(m: MappingStore): EditScript;
}

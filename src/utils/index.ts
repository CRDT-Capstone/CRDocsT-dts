import { FNode, FTree } from "../dts";

export function randomString(length: number = 10): string {
    let res = new Array<string>(length);
    for (let i = 0; i < length; i++) res[i] = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    return res.join("");
}


function buildValueSet(nodes: FNode[]): Map<string, FNode>{
    const set = new Map<string, FNode>();
    for (const node of nodes){
        set.set(JSON.stringify(node.id), node);
    }
    return set;
}

/**
 * Provides a list of ndes that are in tree A that are not in tree B
 */
export function diff(treeA: FTree, treeB: FTree): FNode[]{
    const nodesA = Array.from(treeA.getNodes().values()).flat();
    const nodesB = Array.from(treeB.getNodes().values()).flat();


    const setA = buildValueSet(nodesA);
    const setB = buildValueSet(nodesB);

    const nodeDiff: FNode[] = [];
    for(const [key, node] of setA.entries()){
        if(!setB.has(key)){
            nodeDiff.push(node);
        }
    }

    return nodeDiff;
}


import { v4 } from "uuid";
import { AstNode, BragiAST, NodeId } from "../treesitter";



export const MORE_COMPLEX_AST: BragiAST = {
    rootId: "a1b2c3d4-0000-4000-8000-000000000001",
    nodes: new Map([
        [
            "a1b2c3d4-0000-4000-8000-000000000001",
            {
                id: "a1b2c3d4-0000-4000-8000-000000000001",
                parentId: null,
                type: "source_file",
                text: "The quick brown fox jumped over the lazy dog. A slow red cat crept under the sleepy log.",
                childrenIds: [
                    "a1b2c3d4-0000-4000-8000-000000000002",
                    "a1b2c3d4-0000-4000-8000-000000000003",
                ],
            },
        ],

        // --- Sentence 1 ---
        [
            "a1b2c3d4-0000-4000-8000-000000000002",
            {
                id: "a1b2c3d4-0000-4000-8000-000000000002",
                parentId: "a1b2c3d4-0000-4000-8000-000000000001",
                type: "text",
                text: "The quick brown fox jumped over the lazy dog.",
                word: [
                    "a1b2c3d4-0000-4000-8000-000000000010",
                    "a1b2c3d4-0000-4000-8000-000000000011",
                    "a1b2c3d4-0000-4000-8000-000000000012",
                    "a1b2c3d4-0000-4000-8000-000000000013",
                    "a1b2c3d4-0000-4000-8000-000000000014",
                    "a1b2c3d4-0000-4000-8000-000000000015",
                    "a1b2c3d4-0000-4000-8000-000000000016",
                    "a1b2c3d4-0000-4000-8000-000000000017",
                    "a1b2c3d4-0000-4000-8000-000000000018",
                ],
                childrenIds: [],
            },
        ],
        ["a1b2c3d4-0000-4000-8000-000000000010", { id: "a1b2c3d4-0000-4000-8000-000000000010", parentId: "a1b2c3d4-0000-4000-8000-000000000002", type: "word", text: "The", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000011", { id: "a1b2c3d4-0000-4000-8000-000000000011", parentId: "a1b2c3d4-0000-4000-8000-000000000002", type: "word", text: "quick", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000012", { id: "a1b2c3d4-0000-4000-8000-000000000012", parentId: "a1b2c3d4-0000-4000-8000-000000000002", type: "word", text: "brown", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000013", { id: "a1b2c3d4-0000-4000-8000-000000000013", parentId: "a1b2c3d4-0000-4000-8000-000000000002", type: "word", text: "fox", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000014", { id: "a1b2c3d4-0000-4000-8000-000000000014", parentId: "a1b2c3d4-0000-4000-8000-000000000002", type: "word", text: "jumped", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000015", { id: "a1b2c3d4-0000-4000-8000-000000000015", parentId: "a1b2c3d4-0000-4000-8000-000000000002", type: "word", text: "over", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000016", { id: "a1b2c3d4-0000-4000-8000-000000000016", parentId: "a1b2c3d4-0000-4000-8000-000000000002", type: "word", text: "the", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000017", { id: "a1b2c3d4-0000-4000-8000-000000000017", parentId: "a1b2c3d4-0000-4000-8000-000000000002", type: "word", text: "lazy", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000018", { id: "a1b2c3d4-0000-4000-8000-000000000018", parentId: "a1b2c3d4-0000-4000-8000-000000000002", type: "word", text: "dog.", childrenIds: [] }],

        // --- Sentence 2 ---
        [
            "a1b2c3d4-0000-4000-8000-000000000003",
            {
                id: "a1b2c3d4-0000-4000-8000-000000000003",
                parentId: "a1b2c3d4-0000-4000-8000-000000000001",
                type: "text",
                text: "A slow red cat crept under the sleepy log.",
                word: [
                    "a1b2c3d4-0000-4000-8000-000000000020",
                    "a1b2c3d4-0000-4000-8000-000000000021",
                    "a1b2c3d4-0000-4000-8000-000000000022",
                    "a1b2c3d4-0000-4000-8000-000000000023",
                    "a1b2c3d4-0000-4000-8000-000000000024",
                    "a1b2c3d4-0000-4000-8000-000000000025",
                    "a1b2c3d4-0000-4000-8000-000000000026",
                    "a1b2c3d4-0000-4000-8000-000000000027",
                    "a1b2c3d4-0000-4000-8000-000000000028",
                ],
                childrenIds: [],
            },
        ],
        ["a1b2c3d4-0000-4000-8000-000000000020", { id: "a1b2c3d4-0000-4000-8000-000000000020", parentId: "a1b2c3d4-0000-4000-8000-000000000003", type: "word", text: "A", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000021", { id: "a1b2c3d4-0000-4000-8000-000000000021", parentId: "a1b2c3d4-0000-4000-8000-000000000003", type: "word", text: "slow", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000022", { id: "a1b2c3d4-0000-4000-8000-000000000022", parentId: "a1b2c3d4-0000-4000-8000-000000000003", type: "word", text: "red", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000023", { id: "a1b2c3d4-0000-4000-8000-000000000023", parentId: "a1b2c3d4-0000-4000-8000-000000000003", type: "word", text: "cat", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000024", { id: "a1b2c3d4-0000-4000-8000-000000000024", parentId: "a1b2c3d4-0000-4000-8000-000000000003", type: "word", text: "crept", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000025", { id: "a1b2c3d4-0000-4000-8000-000000000025", parentId: "a1b2c3d4-0000-4000-8000-000000000003", type: "word", text: "under", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000026", { id: "a1b2c3d4-0000-4000-8000-000000000026", parentId: "a1b2c3d4-0000-4000-8000-000000000003", type: "word", text: "the", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000027", { id: "a1b2c3d4-0000-4000-8000-000000000027", parentId: "a1b2c3d4-0000-4000-8000-000000000003", type: "word", text: "sleepy", childrenIds: [] }],
        ["a1b2c3d4-0000-4000-8000-000000000028", { id: "a1b2c3d4-0000-4000-8000-000000000028", parentId: "a1b2c3d4-0000-4000-8000-000000000003", type: "word", text: "log.", childrenIds: [] }],
    ]),
};

export const AST: BragiAST = {
    rootId: "3faa84f7-2660-48c5-b5ef-72637d1abc57",
    nodes: new Map([
        [
            "3faa84f7-2660-48c5-b5ef-72637d1abc57",
            {
                id: "3faa84f7-2660-48c5-b5ef-72637d1abc57",
                parentId: null,
                type: "source_file",
                text: "The quick brown fox jumped over the lazy dog.",
                childrenIds: ["d4fb2e8e-9aff-46ca-a780-8d1ca7435231"],
            },
        ],
        [
            "d4fb2e8e-9aff-46ca-a780-8d1ca7435231",
            {
                id: "d4fb2e8e-9aff-46ca-a780-8d1ca7435231",
                parentId: "3faa84f7-2660-48c5-b5ef-72637d1abc57",
                type: "text",
                text: "The quick brown fox jumped over the lazy dog.",
                word: [
                    "26f76010-f5ff-44e0-aaf9-900689a07e58",
                    "a6f9dc3f-2059-4703-9b14-2e4ec9e2d014",
                    "e6af0291-90b7-44c2-b8e9-0c1ad4023773",
                    "4a106757-45a3-4457-8d9a-2818fc06b393",
                    "eac545d7-9102-4875-937d-85a3b8094873",
                    "c3a75404-b9b7-4e03-96f3-cb0d0fd79fbf",
                    "e7fe0da4-e45b-4504-a504-f5613cf82e72",
                    "26df82fd-534d-4a44-84bf-957cbd1d12df",
                    "788be876-fef8-4cef-a602-eecf60d84694",
                ],
                childrenIds: [

                ],
            },
        ],
        [
            "26f76010-f5ff-44e0-aaf9-900689a07e58",
            {
                id: "26f76010-f5ff-44e0-aaf9-900689a07e58",
                parentId: "d4fb2e8e-9aff-46ca-a780-8d1ca7435231",
                type: "word",
                text: "The",
                childrenIds: [],
            },
        ],
        [
            "a6f9dc3f-2059-4703-9b14-2e4ec9e2d014",
            {
                id: "a6f9dc3f-2059-4703-9b14-2e4ec9e2d014",
                parentId: "d4fb2e8e-9aff-46ca-a780-8d1ca7435231",
                type: "word",
                text: "quick",
                childrenIds: [],
            },
        ],
        [
            "e6af0291-90b7-44c2-b8e9-0c1ad4023773",
            {
                id: "e6af0291-90b7-44c2-b8e9-0c1ad4023773",
                parentId: "d4fb2e8e-9aff-46ca-a780-8d1ca7435231",
                type: "word",
                text: "brown",
                childrenIds: [],
            },
        ],
        [
            "4a106757-45a3-4457-8d9a-2818fc06b393",
            {
                id: "4a106757-45a3-4457-8d9a-2818fc06b393",
                parentId: "d4fb2e8e-9aff-46ca-a780-8d1ca7435231",
                type: "word",
                text: "fox",
                childrenIds: [],
            },
        ],
        [
            "eac545d7-9102-4875-937d-85a3b8094873",
            {
                id: "eac545d7-9102-4875-937d-85a3b8094873",
                parentId: "d4fb2e8e-9aff-46ca-a780-8d1ca7435231",
                type: "word",
                text: "jumped",
                childrenIds: [],
            },
        ],
        [
            "c3a75404-b9b7-4e03-96f3-cb0d0fd79fbf",
            {
                id: "c3a75404-b9b7-4e03-96f3-cb0d0fd79fbf",
                parentId: "d4fb2e8e-9aff-46ca-a780-8d1ca7435231",
                type: "word",
                text: "over",
                childrenIds: [],
            },
        ],
        [
            "e7fe0da4-e45b-4504-a504-f5613cf82e72",
            {
                id: "e7fe0da4-e45b-4504-a504-f5613cf82e72",
                parentId: "d4fb2e8e-9aff-46ca-a780-8d1ca7435231",
                type: "word",
                text: "the",
                childrenIds: [],
            },
        ],
        [
            "26df82fd-534d-4a44-84bf-957cbd1d12df",
            {
                id: "26df82fd-534d-4a44-84bf-957cbd1d12df",
                parentId: "d4fb2e8e-9aff-46ca-a780-8d1ca7435231",
                type: "word",
                text: "lazy",
                childrenIds: [],
            },
        ],
        [
            "788be876-fef8-4cef-a602-eecf60d84694",
            {
                id: "788be876-fef8-4cef-a602-eecf60d84694",
                parentId: "d4fb2e8e-9aff-46ca-a780-8d1ca7435231",
                type: "word",
                text: "dog.",
                childrenIds: [],
            },
        ],
    ]),
};



export function doDeletion(ast: BragiAST, index: number): BragiAST {
    
    const newAST = structuredClone(ast);
    const keys = Array.from(newAST.nodes.keys());
    const deletedKey = keys[index];
    newAST.nodes.delete(deletedKey);
    const newNodes = new Map<NodeId, AstNode>();

    //remove the nodes that have the deleted node as their parent
    //and remove the deleted node id from word and children arrays
    for(const node of newAST.nodes.values()){
        if(node.parentId === deletedKey) continue;
        node.childrenIds = node.childrenIds.filter((id)=> id!== deletedKey);
        if(node.type === "text"){
            node.word = node.word.filter((id)=> id !== deletedKey);
        }
        newNodes.set(node.id, node);
    }
    
    newAST.nodes = newNodes;

    return newAST;
}

export function doInsertion(ast: BragiAST, index: number): BragiAST {
    const id = v4();
    const newAST = structuredClone(ast);

    const newNode: AstNode = {
        id,
        parentId: null, //for now
        type: "word",
        text: "dog.",
        childrenIds: [],
    };

    newAST.nodes.set(id, newNode);
    const keys = Array.from(ast.nodes.keys());

    const node = newAST.nodes.get(keys[index])!;
    newNode.parentId = node.id;
    if(node.type === "text"){
        node.word.push(newNode.id);
    }else{
        node.childrenIds.push(newNode.id);
    }

    return newAST;
}

export function getFirstTextNode(ast: BragiAST){
    for(const [id, node] of ast.nodes.entries()){
        if(node.type === "text") return node;
    }
    return undefined;
}

export function doInsertionToTextNode(ast: BragiAST): BragiAST {

    
    const id = v4();
    const newAST = structuredClone(ast);

    const TextNode = getFirstTextNode(newAST);
    if(!TextNode) throw Error("This tree doesn't have any text nodes");
    
    TextNode.word.push(id);
    const newNode: AstNode = {
        id,
        parentId: TextNode.id, 
        type: "word",
        text: "Tani",
        childrenIds: [],
    };

    TextNode.text = `${TextNode.text} ${newNode.text}`;

    newAST.nodes.set(id, newNode);


    return newAST;
}

export function doDeletionFromTextNode(ast: BragiAST): BragiAST {

    const newAST = structuredClone(ast);

    const TextNode = getFirstTextNode(newAST);
    if(!TextNode) throw Error("This tree doesn't have any text nodes");
    
    //WLOG just gonna delete the last word
    const deletedNodeId = TextNode.word.pop()!;
    const deletedNode = newAST.nodes.get(deletedNodeId)!;

    newAST.nodes.delete(deletedNodeId);

    const newNodes = new Map<NodeId, AstNode>();

    //remove the nodes that have the deleted node as their parent
    //and remove the deleted node id from word and children arrays
    for(const node of newAST.nodes.values()){
        if(node.parentId === deletedNodeId) continue;
        node.childrenIds = node.childrenIds.filter((id)=> id!== deletedNodeId);
        if(node.type === "text"){
            node.word = node.word.filter((id)=> id !== deletedNodeId);
        }
        newNodes.set(node.id, node);
    }
    
    newAST.nodes = newNodes;

    const newText = TextNode.text.split(' ').filter((word)=> word !== deletedNode.text).join(" ");
    TextNode.text = newText;

    //assuming words can't have any children here 


    return newAST;
}

export function createNewAST(ast: BragiAST): BragiAST {
    const newAST = structuredClone(ast);
    const newNodes = new Map<string, AstNode>();
    const visited = new Set();

    function dfs(node?: AstNode, parentId: string | null = null) {
        if (!node) return;

        if(visited.has(node)) return;

        visited.add(node);
        const newId = v4();
        node.parentId = parentId;

        node.id = newId;
        newNodes.set(newId, node);
        if (node.type === "text") {
            const oldWordIds = node.word;
            const newWordIds: string[] = [];
            for (const oldId of oldWordIds) {
                const childNode = newAST.nodes.get(oldId);
                dfs(childNode, newId);
                if (childNode) newWordIds.push(childNode.id);
            }
            node.word = newWordIds;
        }
        const oldChildrenIds = node.childrenIds;
        const newChildrenIds: string[] = [];
        for (const oldId of oldChildrenIds) {

            const childNode = newAST.nodes.get(oldId);
            dfs(childNode, newId);
            if (childNode) newChildrenIds.push(childNode.id);
        }
        node.childrenIds = newChildrenIds;



    }

    const root = newAST.nodes.get(newAST.rootId);

    dfs(root);
    newAST.rootId = root!.id;
    newAST.nodes = newNodes;
    return newAST;

}


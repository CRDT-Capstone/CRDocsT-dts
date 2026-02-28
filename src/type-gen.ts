// Inspired by https://github.com/github/semantic/tree/main/semantic-ast
import { writeFileSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dir = dirname(__filename);
const INPUT_PATH = join(dir, "node-types.json"); // Adjust as needed
const OUTPUT_PATH = join(dir, "treesitter", "types", "AST.ts");

interface NodeTypeReference {
    type: string;
    named: boolean;
}

interface NodeChildrenDefinition {
    multiple: boolean;
    required: boolean;
    types: NodeTypeReference[];
}

interface NodeTypeDefinition {
    type: string;
    named: boolean;
    subtypes?: NodeTypeReference[];
    fields?: Record<string, NodeChildrenDefinition>;
    children?: NodeChildrenDefinition;
}

const toPascalCase = (str: string): string => {
    return (
        str
            .match(/[a-z_]+/gi)
            ?.map((word) =>
                word
                    .split("_")
                    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                    .join(""),
            )
            .join("") || str
    );
};

function generate() {
    const rawData = readFileSync(INPUT_PATH, "utf8");
    const nodes = JSON.parse(rawData) as NodeTypeDefinition[];

    let output = `// Auto-generated from node-types.json\n\n`;
    output += `import  { Node } from 'web-tree-sitter';
import { v4 } from 'uuid'

export type NodeId = string;

export interface ParserContext {
    nodes: Map<NodeId, AstNode>;
}

`;

    let interfacesOut = `// Interfaces

`;
    let unmarshalersOut = `// Unmarshalers

`;
    let switches = "";

    const allNamedNodes: string[] = [];

    for (const node of nodes) {
        if (!node.named) continue;

        // Generate interfaces
        const interfaceName = toPascalCase(node.type) + "Node";

        // Handle Supertypes
        if (node.subtypes && node.subtypes.length > 0) {
            const subtypeNames = node.subtypes.filter((st) => st.named).map((st) => toPascalCase(st.type) + "Node");

            if (subtypeNames.length > 0) {
                interfacesOut += `export type ${interfaceName} = ${subtypeNames.join(" | ")};\n\n`;
            }
            continue;
        }
        allNamedNodes.push(interfaceName);

        // Handle Standard Concrete Nodes
        interfacesOut += `export interface ${interfaceName} {\n`;

        // Use a Map to track properties so we can merge collisions
        const props = new Map<string, { type: string; optional: boolean }>();

        // Set default properties
        props.set("id", { type: "NodeId", optional: false });
        props.set("parentId", { type: "NodeId | null", optional: false });
        props.set("type", { type: `'${node.type}'`, optional: false });
        props.set("text", { type: "string", optional: false });
        props.set("startIndex", {type: "number", optional: false});
        props.set("endIndex", {type: "number", optional: false});

        // Map Fields
        if (node.fields) {
            for (const [fieldName, fieldData] of Object.entries(node.fields)) {
                let typeString = fieldData.multiple ? "NodeId[]" : "NodeId";
                const isOptional = !fieldData.required;
                if (props.has(fieldName)) {
                    // Merge types on collision
                    const existing = props.get(fieldName)!;
                    existing.type = `${existing.type} | ${typeString}`;
                    existing.optional = existing.optional && isOptional;
                } else {
                    props.set(fieldName, { type: typeString, optional: isOptional });
                }
            }
        }

        props.set("childrenIds", { type: "NodeId[]", optional: false });

        // Write all properties to the interface
        for (const [propName, propData] of props.entries()) {
            const optMod = propData.optional ? "?" : "";
            interfacesOut += `  ${propName}${optMod}: ${propData.type};\n`;
        }

        interfacesOut += `}\n\n`;

        // Generate Unmarshalers
        const funcName = `unmarshaler${interfaceName}`;
        switches += `case '${node.type}': return ${funcName}(node, ctx, parentId);\n`;

        unmarshalersOut += `function ${funcName}(node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId {
            const id = v4();
            const n: Partial<${interfaceName}> = {
                id,
                parentId,
                type: '${node.type}',
                text: node.text,
                startIndex: node.startIndex, 
                endIndex: node.endIndex
            };
            ctx.nodes.set(id, n as AstNode);

`;

        let fieldExtractionNodes = "";
        if (node.fields) {
            for (const [fieldName, fieldData] of Object.entries(node.fields)) {
                if (fieldData.multiple) {
                    unmarshalersOut += `n.${fieldName} = node.childrenForFieldName('${fieldName}').map(n => unmarshalNode(n, ctx, id));\n`;
                    fieldExtractionNodes += `...node.childrenForFieldName('${fieldName}').map(n => n.id), `;
                } else {
                    if (fieldData.required) {
                        unmarshalersOut += `n.${fieldName} = unmarshalNode(node.childForFieldName('${fieldName}')!, ctx, id);\n`;
                        fieldExtractionNodes += `node.childForFieldName('${fieldName}')!.id, `;
                    } else {
                        unmarshalersOut += `const ${fieldName}Node = node.childForFieldName('${fieldName}');
n.${fieldName} = ${fieldName}Node ? unmarshalNode(${fieldName}Node, ctx, id) : undefined;
`;
                        fieldExtractionNodes += `${fieldName}Node ? ${fieldName}Node.id : undefined, `;
                    }
                }
            }
        }

        if (fieldExtractionNodes.length > 0) {
            unmarshalersOut += `
const fieldNodes = new Set([${fieldExtractionNodes}].filter(id => id !== undefined));
n.childrenIds = node.namedChildren.filter(n => !fieldNodes.has(n.id)).map(n => unmarshalNode(n, ctx, id));
`;
        } else {
            unmarshalersOut += `n.childrenIds = node.namedChildren.map(n => unmarshalNode(n, ctx, id));\n`;
        }

        unmarshalersOut += `return id;
}

`;
    }

    const core = `// Parser core

export const unmarshalNode = (node: Node, ctx: ParserContext, parentId: NodeId | null): NodeId => {
    switch(node.type) {
        ${switches}
        default: {
            const id = v4();
            const n = {
                id,
                parentId,
                type: node.type as any,
                text: node.text,
                childrenIds: [] as NodeId[],
                startIndex: node.startIndex, 
                endIndex: node.endIndex
            };
            ctx.nodes.set(id, n as AstNode);
            n.childrenIds = node.namedChildren.map(n => unmarshalNode(n, ctx, id));
            return id;
        }
    }
}

 export type BragiAST = {rootId: NodeId, nodes: Map<NodeId, AstNode> };

 // Parses a treesitter CST into a Bragi AST node map
 export const parseCST = (root: Node | null) : BragiAST => {
     if (!root) throw new Error ("No root node provided");
     const ctx: ParserContext = { nodes: new Map() };
     const rootId = unmarshalNode(root, ctx, null);
     return {rootId, nodes: ctx.nodes};
 }

 export const nodeEquals = (nodeA: AstNode | undefined, nodeB: AstNode | undefined): boolean => {
    if (!nodeA || !nodeB) return false;
    return (
        nodeA.parentId === nodeB.parentId &&
        nodeA.text === nodeB.text &&
        nodeA.type === nodeB.type
    );
}
    `;

    // Create a generic ASTNode type
    const concreteNodes = nodes
        .filter((n) => n.named && (!n.subtypes || n.subtypes.length === 0))
        .map((n) => toPascalCase(n.type) + "Node");
    const genericType = `export type AstNode = ${concreteNodes.join(" | ")};\n`;

    // Consolidate output
    output += `
    ${interfacesOut}

    ${genericType}

    ${unmarshalersOut}

    ${core}
    `;

    writeFileSync(OUTPUT_PATH, output);
    console.log(`Successfully generated AST types at ${OUTPUT_PATH}`);
}

generate();

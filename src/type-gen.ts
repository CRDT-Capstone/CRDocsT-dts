// Inspired by https://github.com/github/semantic/tree/main/semantic-ast
import { writeFileSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { logger } from "./utils/logging.js";

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

        // Map Fields skipping any field whose name collides with a reserved base property
        const RESERVED = new Set(["id", "parentId", "type", "text", "childrenIds"]);
        if (node.fields) {
            for (const [fieldName, fieldData] of Object.entries(node.fields)) {
                if (RESERVED.has(fieldName)) continue;
                const typeString = fieldData.multiple ? "NodeId[]" : "NodeId";
                const isOptional = !fieldData.required;
                props.set(fieldName, { type: typeString, optional: isOptional });
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
            };
            ctx.nodes.set(id, n as AstNode);

`;

        // Unmarshal all namedChildren once into childrenIds.
        unmarshalersOut += `    n.childrenIds = node.namedChildren.map(child => unmarshalNode(child, ctx, id));\n\n`;

        // Assign field properties by index-lookup into the already-built childrenIds.
        if (node.fields) {
            const nonReservedFields = Object.entries(node.fields).filter(([fieldName]) => !RESERVED.has(fieldName));
            if (nonReservedFields.length > 0) {
                for (const [fieldName, fieldData] of nonReservedFields) {
                    if (fieldData.multiple) {
                        unmarshalersOut += `    n.${fieldName} = node.childrenForFieldName('${fieldName}').map(child => n.childrenIds![node.namedChildren.indexOf(child)]);\n`;
                    } else {
                        if (fieldData.required) {
                            unmarshalersOut += `    { const _fc = node.childForFieldName('${fieldName}'); n.${fieldName} = _fc ? n.childrenIds![node.namedChildren.indexOf(_fc)] : undefined; }\n`;
                        } else {
                            unmarshalersOut += `    { const _fc = node.childForFieldName('${fieldName}'); n.${fieldName} = _fc ? n.childrenIds![node.namedChildren.indexOf(_fc)] : undefined; }\n`;
                        }
                    }
                }
                unmarshalersOut += `\n`;
            }
        }

        unmarshalersOut += `    return id;
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

export const allChildIds = (ast: BragiAST, node: AstNode): string[] => {
    return node.childrenIds;
};

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
    logger.log(`Successfully generated AST types at ${OUTPUT_PATH}`);
}

generate();

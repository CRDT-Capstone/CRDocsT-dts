import * as fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dir = dirname(__filename);
const INPUT_PATH = join(dir, "node-types.json"); // Adjust as needed
const OUTPUT_PATH = join(dir, "types", "AST.ts");

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
    const rawData = fs.readFileSync(INPUT_PATH, "utf8");
    const nodes = JSON.parse(rawData) as NodeTypeDefinition[];

    let output = `// Auto-generated from node-types.json\n\n`;

    const allNamedNodes: string[] = [];

    for (const node of nodes) {
        if (!node.named) continue;

        const interfaceName = toPascalCase(node.type) + "Node";
        allNamedNodes.push(interfaceName);

        // Handle Supertypes
        if (node.subtypes && node.subtypes.length > 0) {
            const subtypeNames = node.subtypes.filter((st) => st.named).map((st) => toPascalCase(st.type) + "Node");

            if (subtypeNames.length > 0) {
                output += `export type ${interfaceName} = ${subtypeNames.join(" | ")};\n\n`;
            }
            continue;
        }

        // Handle Standard Concrete Nodes
        output += `export interface ${interfaceName} {\n`;

        // Use a Map to track properties so we can merge collisions
        const properties = new Map<string, { type: string; optional: boolean }>();

        // Set default properties
        properties.set("type", { type: `'${node.type}'`, optional: false });
        properties.set("text", { type: "string", optional: false });

        // Map Fields
        if (node.fields) {
            for (const [fieldName, fieldData] of Object.entries(node.fields)) {
                const types = fieldData.types.filter((t) => t.named).map((t) => toPascalCase(t.type) + "Node");

                let typeString = types.length > 0 ? types.join(" | ") : "any";

                // Array union syntax
                if (fieldData.multiple) {
                    typeString = types.length > 1 ? `(${typeString})[]` : `${typeString}[]`;
                }

                const isOptional = !fieldData.required;

                if (properties.has(fieldName)) {
                    // Merge types on collision
                    const existing = properties.get(fieldName)!;
                    existing.type = `${existing.type} | ${typeString}`;
                    existing.optional = existing.optional && isOptional;
                } else {
                    properties.set(fieldName, { type: typeString, optional: isOptional });
                }
            }
        }

        // Map standard children
        if (node.children) {
            const types = node.children.types.filter((t) => t.named).map((t) => toPascalCase(t.type) + "Node");

            let typeString = types.length > 0 ? types.join(" | ") : "any";
            if (types.length > 1) {
                typeString = `(${typeString})[]`;
            } else if (types.length === 1) {
                typeString = `${typeString}[]`;
            } else {
                typeString = "any[]";
            }

            // Merge if children was already defined as a specific field
            if (properties.has("children")) {
                const existing = properties.get("children")!;
                existing.type = `${existing.type} | ${typeString}`;
            } else {
                properties.set("children", { type: typeString, optional: false });
            }
        }

        // Write all properties to the interface
        for (const [propName, propData] of properties.entries()) {
            const optMod = propData.optional ? "?" : "";
            output += `  ${propName}${optMod}: ${propData.type};\n`;
        }

        output += `}\n\n`;
    }

    // Create a generic ASTNode type
    const concreteNodes = nodes
        .filter((n) => n.named && (!n.subtypes || n.subtypes.length === 0))
        .map((n) => toPascalCase(n.type) + "Node");

    output += `export type AstNode = ${concreteNodes.join(" | ")};\n`;

    fs.writeFileSync(OUTPUT_PATH, output);
    console.log(`Successfully generated AST types at ${OUTPUT_PATH}`);
}

generate();

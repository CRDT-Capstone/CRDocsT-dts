import { FugueTree } from "../../../dts";
import { parseCST } from "../../../treesitter.js";
import { getParser } from "../../unit/mocks/BragiAST-mocks.js";

export const DOC_ID = "integration-test-doc";
export const USER_ID = "integration-tester";

/**
 * Realistic LaTeX fixtures representing common document structures.
 */
export const LATEX_FIXTURES = {
    SIMPLE_SECTION: `\\section{Introduction}\nThis is a test document.`,
    ENUMERATION: `
        \\begin{enumerate}
            \\item First item
            \\item Second item
        \\end{enumerate}
    `,
    NESTED_STRUCTURE: `
        \\section{Math}
        \\begin{equation}
            E = mc^2
        \\end{equation}
    `,
    MALFORMED_LATEX: `\\section{Missing Brace`,
};

/**
 * Creates a FugueTree pre-populated with specific LaTeX content.
 */
export function makeTreeWithContent(content: string, replicaId?: string): FugueTree {
    const tree = new FugueTree(null, DOC_ID, replicaId ? replicaId : USER_ID);
    tree.insertMultiple(0, content);
    return tree;
}

/**
 * Re-exports the parser getter for convenience.
 */
export { getParser };

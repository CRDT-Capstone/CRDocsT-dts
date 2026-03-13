import { parseCST, BragiAST } from "../treesitter/types/AST.js";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { Language, Parser } from "web-tree-sitter";

const __filename = fileURLToPath(import.meta.url);
const __cwd = process.cwd();

let initPromise: Promise<void> | null = null;
let latexLanguage: Language | null = null;

const ensureInit = async (): Promise<void> => {
    if (initPromise) return initPromise;

    const treeSitterWasm = join(__cwd, "src", "wasm", "web-tree-sitter.wasm");
    const latexWasm = join(__cwd, "src", "wasm", "tree-sitter-latex.wasm");

    initPromise = (async () => {
        await Parser.init({
            locateFile: (name: string) => {
                // if (name === "tree-sitter.wasm") return resolve(treeSitterWasm);
                return resolve(treeSitterWasm);
            },
        });
        // Language.load is also a WASM allocation — cache it for the same reason.
        latexLanguage = await Language.load(resolve(latexWasm));
    })();

    return initPromise;
};

export const getParser = async (): Promise<Parser> => {
    await ensureInit();

    const parser = new Parser();
    // latexLanguage is guaranteed non-null after ensureInit resolves
    parser.setLanguage(latexLanguage!);
    return parser;
};

/**
 * Safely parses source code into a JS AST and instantly destroys the WASM
 * memory. Use this in your tests instead of calling getParser() directly!
 */
export const getSafeAst = async (sourceCode: string): Promise<BragiAST> => {
    const parser = await getParser();
    const tree = parser.parse(sourceCode);

    if (!tree || !tree.rootNode) {
        throw new Error("Parse failed");
    }

    const ast = parseCST(tree.rootNode);

    tree.delete();
    parser.delete();

    return ast;
};

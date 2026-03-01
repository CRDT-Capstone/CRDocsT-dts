import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { Language, Parser } from "web-tree-sitter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getParser = async () => {
    const latexWasm = join(__dirname, "tree-sitter-latex.wasm");
    const treeSitterWasm = join(__dirname, "tree-sitter.wasm");
    try {
        await Parser.init({
            locateFile: (name: string, dir: string) => {
                // If it's looking for the main tree-sitter.wasm,
                // give it the specific path provided.
                if (name === "tree-sitter.wasm") {
                    return resolve(treeSitterWasm);
                }
                return join(dir, name);
            },
        });

        const parser = new Parser();

        // Load the language WASM from the absolute path
        const Latex = await Language.load(resolve(latexWasm));
        parser.setLanguage(Latex);

        return parser;
    } catch (error) {
        console.error("Error initializing Tree-sitter:", error);
        throw error;
    }
};

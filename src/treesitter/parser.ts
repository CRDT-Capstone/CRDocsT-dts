import { Language, Parser, Query } from "web-tree-sitter";

let initParserPromise: Promise<{ parser: Parser }> | null = null;

export const newParser = async (treeSitterLatexPath: string, treesitterPath: string) => {
    if (initParserPromise) return initParserPromise;
    initParserPromise = (async () => {
        try {
            await Parser.init({
                locateFile: (name: string, dir: string) => {
                    return `${treesitterPath}`;
                },
            });
            const parser = new Parser();
            const Latex = await Language.load(treeSitterLatexPath);
            parser.setLanguage(Latex);

            return { parser };
        } catch (error) {
            initParserPromise = null;
            console.error("Error initializing tree-sitter:", error);
            throw error;
        }
    })();
    return initParserPromise;
};

let initParserAndQueryPromise: Promise<{ parser: Parser; query: Query }> | null = null;

export const newParserAndQuery = async (
    treeSitterLatexPath: string,
    queryFilePath: string,
    treesitterPath: string = "/tree-sitter.wasm",
) => {
    if (initParserAndQueryPromise) return initParserAndQueryPromise;
    initParserAndQueryPromise = (async () => {
        try {
            const { parser } = await newParser(treeSitterLatexPath, treesitterPath);

            // Load query file from public
            const schContent = await fetch(queryFilePath).then((res) => res.text());
            const query = new Query(parser.language!, schContent);
            return { parser, query };
        } catch (error) {
            initParserPromise = null; // Reset on failure to allow retry
            console.error("Error initializing Tree-sitter:", error);
            throw error;
        }
    })();
    return initParserAndQueryPromise;
};

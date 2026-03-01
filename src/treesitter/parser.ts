import { Language, Parser, Query } from "web-tree-sitter";

let initPromise: Promise<{ parser: Parser; query: Query }> | null = null;

export const newParser = async (
    treeSitterLatexPath: string,
    queryFilePath: string,
    treesitterPath: string = "/tree-sitter.wasm",
) => {
    if (initPromise) return initPromise;
    initPromise = (async () => {
        try {
            await Parser.init({
                locateFile: (name: string, dir: string) => {
                    console.log({ name, dir });
                    // return `/${name}`;
                    return `${treesitterPath}`;
                },
            });
            const parser = new Parser();
            // const Latex = await Language.load("/tree-sitter-latex.wasm");
            const Latex = await Language.load(treeSitterLatexPath);
            parser.setLanguage(Latex);

            // Load query file from public
            // const schContent = await fetch("/highlights.scm").then((res) => res.text());
            const schContent = await fetch(queryFilePath).then((res) => res.text());
            const query = new Query(Latex, schContent);
            return { parser, query };
        } catch (error) {
            initPromise = null; // Reset on failure to allow retry
            console.error("Error initializing Tree-sitter:", error);
            throw error;
        }
    })();
    return initPromise;
};

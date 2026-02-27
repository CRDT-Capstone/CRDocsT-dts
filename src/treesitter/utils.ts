import { AstNode, BragiAST } from "./types";

export const preoderAstTraversalFunc = (ast: BragiAST, callback: (node: AstNode) => void) => {
    const stack: AstNode[] = [ast.nodes.get(ast.rootId)!];
    while (stack.length > 0) {
        const node = stack.pop();
        if (!node) continue;
        callback(node);
        for (let i = node.childrenIds.length - 1; i >= 0; i--) {
            const childNode = ast.nodes.get(node.childrenIds[i]);
            if (childNode) stack.push(childNode);
        }
        if (node.type === "text") {
            for (let i = node.word.length - 1; i >= 0; i--) {
                const childNode = ast.nodes.get(node.word[i]);
                if (childNode) stack.push(childNode);
            }
        }
    }
};

export const postorderAstTraversalFunc = (ast: BragiAST, callback: (node: AstNode) => void) => {
    const stack: AstNode[] = [ast.nodes.get(ast.rootId)!];
    const visited = new Set<string>();
    while (stack.length > 0) {
        const node = stack[stack.length - 1];
        if (!node) {
            stack.pop();
            continue;
        }
        if (visited.has(node.id)) {
            callback(node);
            stack.pop();
            continue;
        }
        visited.add(node.id);
        for (let i = node.childrenIds.length - 1; i >= 0; i--) {
            const childNode = ast.nodes.get(node.childrenIds[i]);
            if (childNode) stack.push(childNode);
        }
        if (node.type === "text") {
            for (let i = node.word.length - 1; i >= 0; i--) {
                const childNode = ast.nodes.get(node.word[i]);
                if (childNode) stack.push(childNode);
            }
        }
    }
};

export const breadthFirstAstTraversalFunc = (ast: BragiAST, callback: (node: AstNode) => void) => {
    const queue: AstNode[] = [ast.nodes.get(ast.rootId)!];
    while (queue.length > 0) {
        const node = queue.shift();
        if (!node) continue;
        callback(node);
        for (const childId of node.childrenIds) {
            const childNode = ast.nodes.get(childId);
            if (childNode) queue.push(childNode);
        }
        if (node.type === "text") {
            for (const wordId of node.word) {
                const childNode = ast.nodes.get(wordId);
                if (childNode) queue.push(childNode);
            }
        }
    }
};

export const preoderAstTraversal = (ast: BragiAST): AstNode[] => {
    const result: AstNode[] = [];
    preoderAstTraversalFunc(ast, (node) => result.push(node));
    return result;
};

export const postorderAstTraversal = (ast: BragiAST): AstNode[] => {
    const result: AstNode[] = [];
    postorderAstTraversalFunc(ast, (node) => result.push(node));
    return result;
};

export const breadthFirstAstTraversal = (ast: BragiAST): AstNode[] => {
    const result: AstNode[] = [];
    breadthFirstAstTraversalFunc(ast, (node) => result.push(node));
    return result;
};

export const preorderAstTraversalIterator = function* (ast: BragiAST): IterableIterator<AstNode> {
    const stack: AstNode[] = [ast.nodes.get(ast.rootId)!];
    while (stack.length > 0) {
        const node = stack.pop();
        if (!node) continue;
        yield node;
        for (let i = node.childrenIds.length - 1; i >= 0; i--) {
            const childNode = ast.nodes.get(node.childrenIds[i]);
            if (childNode) stack.push(childNode);
        }
        if (node.type === "text") {
            for (let i = node.word.length - 1; i >= 0; i--) {
                const childNode = ast.nodes.get(node.word[i]);
                if (childNode) stack.push(childNode);
            }
        }
    }
};

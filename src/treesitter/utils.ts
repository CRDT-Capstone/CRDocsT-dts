import { allChildIds, AstNode, BragiAST } from "./types/index.js";

export const preoderAstTraversalFunc = (ast: BragiAST, callback: (node: AstNode) => void) => {
    const stack: AstNode[] = [ast.nodes.get(ast.rootId)!];
    while (stack.length > 0) {
        const node = stack.pop();
        if (!node) continue;
        callback(node);
        const children = allChildIds(ast, node);
        for (let i = children.length - 1; i >= 0; i--) {
            const childNode = ast.nodes.get(children[i]);
            if (childNode) stack.push(childNode);
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
        const children = allChildIds(ast, node);
        for (let i = children.length - 1; i >= 0; i--) {
            const childNode = ast.nodes.get(children[i]);
            if (childNode) stack.push(childNode);
        }
    }
};

export const breadthFirstAstTraversalFunc = (ast: BragiAST, callback: (node: AstNode) => void) => {
    const queue: AstNode[] = [ast.nodes.get(ast.rootId)!];
    while (queue.length > 0) {
        const node = queue.shift();
        if (!node) continue;
        callback(node);
        const children = allChildIds(ast, node);
        for (const childId of children) {
            const childNode = ast.nodes.get(childId);
            if (childNode) queue.push(childNode);
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
        const children = allChildIds(ast, node);
        for (let i = children.length - 1; i >= 0; i--) {
            const childNode = ast.nodes.get(children[i]);
            if (childNode) stack.push(childNode);
        }
    }
};

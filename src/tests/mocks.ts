import { FugueList, FugueTree, StringTotalOrder } from "../dts/index.js";
import crypto from "crypto";
import { BragiAST } from "./../treesitter";

export const emptyFugueList = new FugueList<string>(
    new StringTotalOrder(crypto.randomBytes(3).toString("hex")),
    null,
    crypto.randomBytes(24).toString("hex"),
);

export const emptyFugueTree = new FugueTree(null, crypto.randomBytes(24).toString("hex"), "test-tree");


import { FugueList, StringTotalOrder } from "../dts/index.js";
import crypto from "crypto";

export const emptyFugueList = new FugueList<string>(
    new StringTotalOrder(crypto.randomBytes(3).toString("hex")),
    null,
    crypto.randomBytes(24).toString("hex"),
);


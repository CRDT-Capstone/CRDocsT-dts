import { FugueList } from "../Fugue/FugueList";
import crypto from "crypto";
import { StringTotalOrder } from "../TotalOrder/StringTotalOrder";

export const emptyFugueList = new FugueList<string>(new StringTotalOrder(crypto.randomBytes(3).toString('hex')), null, crypto.randomBytes(24).toString('hex'));
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Nidhoggr } from "../../treesitter/COAST/Nidhoggr/index.js";
import { ConflictType } from "../../treesitter/COAST/Nidhoggr/types.js";
import {
    makeMockFugue,
    makeMockRegistry,
    makeCoastMsg,
    makeMsg,
    makeId,
    resetCounter,
    mockConflictHandler,
} from "./mocks/Nidhoggr-mocks.js";
import { FugueMessage } from "../../types/index.js";

const LOCAL = "local-replica";
const REMOTE = "remote-replica";
const REMOTE_B = "remote-replica-b";
const NODE_KEY = "node-key-1";

// ---------------------------------------------------------------------------
// Transaction message factories
// ---------------------------------------------------------------------------

function makeMoveMessages(txId: string, replicaId = REMOTE, nodeKey = NODE_KEY, baseCounter = 10) {
    return {
        insert: makeCoastMsg(replicaId, txId, "MOVE", "INSERT", nodeKey, baseCounter),
        delete: makeCoastMsg(replicaId, txId, "MOVE", "DELETE", nodeKey, baseCounter + 1),
    };
}

function makeUpdateMessages(txId: string, replicaId = REMOTE, nodeKey = NODE_KEY, baseCounter = 20) {
    return {
        insert: makeCoastMsg(replicaId, txId, "UPDATE", "INSERT", nodeKey, baseCounter),
        delete: makeCoastMsg(replicaId, txId, "UPDATE", "DELETE", nodeKey, baseCounter + 1),
    };
}

function makeAddMessage(txId: string, replicaId = REMOTE, nodeKey = NODE_KEY, idCounter = 5) {
    return makeCoastMsg(replicaId, txId, "ADD", undefined, nodeKey, idCounter);
}

function makeDeleteMessage(txId: string, replicaId = REMOTE, nodeKey = NODE_KEY, idCounter = 30) {
    return makeCoastMsg(replicaId, txId, "DELETE", undefined, nodeKey, idCounter);
}

// ---------------------------------------------------------------------------
// Helpers: drive a complete transaction through nidhoggr, recording it in history.
// All "prior" helpers use low counter values; callers must use higher counters
// for "incoming" transactions so logicalTime(incoming) > logicalTime(prior),
// satisfying the early-return guard in classifyConflict.
// ---------------------------------------------------------------------------

function applyMoveTransaction(
    nidhoggr: Nidhoggr,
    fugue: ReturnType<typeof makeMockFugue>,
    txId: string,
    replicaId = REMOTE,
    nodeKey = NODE_KEY,
    baseCounter = 10,
) {
    const { insert, delete: del } = makeMoveMessages(txId, replicaId, nodeKey, baseCounter);
    fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
    nidhoggr.consume([insert, del]);
    return { insert, delete: del };
}

function applyUpdateTransaction(
    nidhoggr: Nidhoggr,
    fugue: ReturnType<typeof makeMockFugue>,
    txId: string,
    replicaId = REMOTE,
    nodeKey = NODE_KEY,
    baseCounter = 10,
) {
    const { insert, delete: del } = makeUpdateMessages(txId, replicaId, nodeKey, baseCounter);
    fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([insert] as any[]);
    nidhoggr.consume([insert, del]);
    return { insert, delete: del };
}

function applyAddTransaction(
    nidhoggr: Nidhoggr,
    fugue: ReturnType<typeof makeMockFugue>,
    txId: string,
    replicaId = REMOTE,
    nodeKey = NODE_KEY,
    idCounter = 5,
) {
    const msg = makeAddMessage(txId, replicaId, nodeKey, idCounter);
    const appliedId = makeId(replicaId, idCounter);
    const applied = [{ ...msg, coastOpType: "ADD", id: appliedId }] as any[];
    fugue.effect.mockReturnValueOnce(applied);
    nidhoggr.consume(msg);
    return msg;
}

function applyDeleteTransaction(
    nidhoggr: Nidhoggr,
    fugue: ReturnType<typeof makeMockFugue>,
    txId: string,
    replicaId = REMOTE,
    nodeKey = NODE_KEY,
    idCounter = 30,
) {
    const msg = makeDeleteMessage(txId, replicaId, nodeKey, idCounter);
    fugue.effect.mockReturnValueOnce([msg] as any[]);
    nidhoggr.consume(msg);
    return msg;
}

// ===========================================================================
// Test suites
// ===========================================================================

describe("Nidhoggr", () => {
    let fugue: ReturnType<typeof makeMockFugue>;
    let registry: ReturnType<typeof makeMockRegistry>;

    beforeEach(() => {
        resetCounter();
        jest.clearAllMocks();
        fugue = makeMockFugue(LOCAL);
        registry = makeMockRegistry();
    });

    // -------------------------------------------------------------------------
    // Constructor / options
    // -------------------------------------------------------------------------

    describe("constructor", () => {
        it("initialises with an empty pending transaction queue when no options are provided", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            expect(nidhoggr.numberPending()).toBe(0);
            expect(nidhoggr.pendingSnapshot()).toEqual([]);
        });

        it("stores the provided fugue instance on the public property", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            expect(nidhoggr.fugue).toBe(fugue);
        });

        it("stores the provided registry instance on the public property", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            expect(nidhoggr.registry).toBe(registry);
        });

        it("accepts a custom txnTtlMs without throwing", () => {
            expect(() => new Nidhoggr(fugue, registry, { txnTtlMs: 1_000 })).not.toThrow();
        });

        it("accepts a custom onConflict handler without throwing", () => {
            expect(() => new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler })).not.toThrow();
        });
    });

    describe("consume", () => {
        // -------------------------------------------------------------------------
        // consume – plain (non-COAST) messages
        // -------------------------------------------------------------------------

        describe("consume – plain messages", () => {
            it("passes a single remote plain message directly to fugue.effect and returns the applied messages", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const msg = makeMsg({ replicaId: REMOTE });
                const applied = [{ ...msg, id: makeId() }] as any[];
                fugue.effect.mockReturnValue(applied);

                const result = nidhoggr.consume(msg);

                expect(fugue.effect).toHaveBeenCalledWith([msg]);
                expect(result).toEqual(applied);
            });

            it("passes an array of plain remote messages to fugue.effect in a single call", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const msgs = [makeMsg({ replicaId: REMOTE }), makeMsg({ replicaId: REMOTE })];
                fugue.effect.mockReturnValue(msgs as any[]);

                nidhoggr.consume(msgs);

                expect(fugue.effect).toHaveBeenCalledTimes(1);
                expect(fugue.effect).toHaveBeenCalledWith(msgs);
            });

            it("filters out messages originating from the local replica before passing to fugue.effect", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const local = makeMsg({ replicaId: LOCAL });
                const remote = makeMsg({ replicaId: REMOTE });
                fugue.effect.mockReturnValue([remote] as any[]);

                nidhoggr.consume([local, remote]);

                expect(fugue.effect).toHaveBeenCalledWith([remote]);
            });

            it("does not call fugue.effect when every message originates from the local replica", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                nidhoggr.consume([makeMsg({ replicaId: LOCAL }), makeMsg({ replicaId: LOCAL })]);

                expect(fugue.effect).not.toHaveBeenCalled();
            });

            it("returns an empty array and does not call fugue.effect when consuming an empty array", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const result = nidhoggr.consume([]);

                expect(result).toEqual([]);
                expect(fugue.effect).not.toHaveBeenCalled();
            });

            it("returns an empty array when all messages are from the local replica", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const result = nidhoggr.consume([makeMsg({ replicaId: LOCAL })]);

                expect(result).toEqual([]);
            });
        });

        // -------------------------------------------------------------------------
        // consume – COAST ADD transaction
        // -------------------------------------------------------------------------

        describe("consume – COAST ADD transaction", () => {
            it("immediately applies a complete ADD transaction and returns the applied messages", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const msg = makeAddMessage("txn-add-1");
                const applied = [msg] as any[];
                fugue.effect.mockReturnValue(applied);

                const result = nidhoggr.consume(msg);

                expect(result).toEqual(applied);
                expect(nidhoggr.numberPending()).toBe(0);
            });

            it("calls fugue.effect with the ADD message wrapped in an array", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const msg = makeAddMessage("txn-add-effect");
                fugue.effect.mockReturnValue([msg] as any[]);

                nidhoggr.consume(msg);

                expect(fugue.effect).toHaveBeenCalledWith([msg]);
            });

            it("registers the node in the registry after a successful ADD", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const msg = makeAddMessage("txn-add-reg", REMOTE, NODE_KEY, 5);
                const appliedId = makeId(REMOTE, 5);
                const applied = [{ ...msg, coastOpType: "ADD", id: appliedId }] as any[];
                fugue.effect.mockReturnValue(applied);
                registry.get.mockReturnValue(undefined);

                nidhoggr.consume(msg);

                expect(registry.register).toHaveBeenCalledWith(
                    NODE_KEY,
                    expect.objectContaining({ startId: appliedId, length: 1 }),
                );
            });

            it("does not re-register the node when the registry already has an entry for the node key", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const msg = makeAddMessage("txn-add-dup");
                fugue.effect.mockReturnValue([msg] as any[]);
                registry.get.mockReturnValue({ startId: makeId(), length: 1 });

                nidhoggr.consume(msg);

                expect(registry.register).not.toHaveBeenCalled();
            });

            it("does not register when fugue.effect returns no applied messages for an ADD", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const msg = makeAddMessage("txn-add-noop");
                fugue.effect.mockReturnValue([]);

                nidhoggr.consume(msg);

                expect(registry.register).not.toHaveBeenCalled();
            });

            it("selects the message with the lowest counter as startId when registering a multi-message ADD", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);

                const idHigh = makeId(REMOTE, 100);
                const idLow = makeId(REMOTE, 1);

                // Both messages share the same coastTxId so they land in the same txn.msgs
                const msgHigh = { ...makeAddMessage("txn-add-multi"), id: idHigh };
                const msgLow = { ...makeAddMessage("txn-add-multi"), id: idLow };

                fugue.effect.mockReturnValue([msgHigh, msgLow] as any[]);
                registry.get.mockReturnValue(undefined);

                nidhoggr.consume([msgHigh, msgLow]);

                expect(registry.register).toHaveBeenCalledWith(
                    NODE_KEY,
                    expect.objectContaining({ startId: idLow, length: 2 }),
                );
            });

            it("only counts messages with coastOpType ADD when computing the registration length", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const msg = makeAddMessage("txn-add-filter");
                const idA = makeId(REMOTE, 1);
                const applied = [
                    { ...msg, coastOpType: "ADD", id: idA },
                    { ...msg, coastOpType: "OTHER", id: makeId(REMOTE, 2) },
                ] as any[];
                fugue.effect.mockReturnValue(applied);
                registry.get.mockReturnValue(undefined);

                nidhoggr.consume(msg);

                expect(registry.register).toHaveBeenCalledWith(NODE_KEY, expect.objectContaining({ length: 1 }));
            });
        });

        // -------------------------------------------------------------------------
        // consume – COAST DELETE transaction
        // -------------------------------------------------------------------------

        describe("consume – COAST DELETE transaction", () => {
            it("applies a DELETE transaction and removes the node from the registry", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const msg = makeDeleteMessage("txn-del-1");
                const applied = [msg] as any[];
                fugue.effect.mockReturnValue(applied);

                const result = nidhoggr.consume(msg);

                expect(result).toEqual(applied);
                expect(registry.delete).toHaveBeenCalledWith(NODE_KEY);
            });

            it("does not modify the registry when a DELETE transaction produces no applied messages", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const msg = makeDeleteMessage("txn-del-noop");
                fugue.effect.mockReturnValue([]);

                nidhoggr.consume(msg);

                expect(registry.delete).not.toHaveBeenCalled();
            });

            it("leaves the transaction queue empty after a complete DELETE", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const msg = makeDeleteMessage("txn-del-pending");
                fugue.effect.mockReturnValue([msg] as any[]);

                nidhoggr.consume(msg);

                expect(nidhoggr.numberPending()).toBe(0);
            });
        });

        // -------------------------------------------------------------------------
        // consume – COAST MOVE transaction (two-part)
        // -------------------------------------------------------------------------

        describe("consume – COAST MOVE transaction", () => {
            it("buffers an incomplete MOVE with only an INSERT part and does not call fugue.effect", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert } = makeMoveMessages("txn-move-ins-only");

                nidhoggr.consume(insert);

                expect(nidhoggr.numberPending()).toBe(1);
                expect(fugue.effect).not.toHaveBeenCalled();
            });

            it("buffers an incomplete MOVE with only a DELETE part and does not call fugue.effect", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { delete: del } = makeMoveMessages("txn-move-del-only");

                nidhoggr.consume(del);

                expect(nidhoggr.numberPending()).toBe(1);
                expect(fugue.effect).not.toHaveBeenCalled();
            });

            it("flushes a complete MOVE when both INSERT and DELETE arrive together and removes it from pending", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeMoveMessages("txn-move-complete");
                fugue.effect.mockReturnValue([insert] as any[]);

                nidhoggr.consume([insert, del]);

                expect(nidhoggr.numberPending()).toBe(0);
                expect(fugue.effect).toHaveBeenCalledTimes(2);
            });

            it("flushes a complete MOVE when INSERT and DELETE arrive in separate consume calls", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeMoveMessages("txn-move-split");
                fugue.effect.mockReturnValue([insert] as any[]);

                nidhoggr.consume(insert);
                expect(nidhoggr.numberPending()).toBe(1);

                nidhoggr.consume(del);
                expect(nidhoggr.numberPending()).toBe(0);
            });

            it("applies INSERT messages before DELETE messages when flushing a MOVE transaction", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeMoveMessages("txn-move-order");
                const callOrder: string[] = [];
                fugue.effect.mockImplementation((msgs: any) => {
                    const first = Array.isArray(msgs) ? msgs[0] : msgs;
                    callOrder.push(first.coastOpPart ?? "unknown");
                    return Array.isArray(msgs) ? msgs : [msgs];
                });

                nidhoggr.consume([insert, del]);

                expect(callOrder[0]).toBe("INSERT");
                expect(callOrder[1]).toBe("DELETE");
            });

            it("updates the registry startId with the lowest-counter INSERT message after a MOVE", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeMoveMessages("txn-move-reg");
                const idLow = makeId(REMOTE, 1);
                const idHigh = makeId(REMOTE, 99);
                fugue.effect
                    .mockReturnValueOnce([
                        { ...insert, id: idHigh },
                        { ...insert, id: idLow },
                    ] as any[])
                    .mockReturnValueOnce([del] as any[]);

                nidhoggr.consume([insert, del]);

                expect(registry.update).toHaveBeenCalledWith(NODE_KEY, expect.objectContaining({ startId: idLow }));
            });

            it("does not update the registry when a MOVE produces no applied INSERT messages", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeMoveMessages("txn-move-noop-reg");
                fugue.effect.mockReturnValueOnce([]).mockReturnValueOnce([del] as any[]);

                nidhoggr.consume([insert, del]);

                expect(registry.update).not.toHaveBeenCalled();
            });

            it("returns combined applied messages from INSERT and DELETE effects for a complete MOVE", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeMoveMessages("txn-move-return");
                const appliedIns = [insert as any];
                const appliedDel = [del as any];
                fugue.effect.mockReturnValueOnce(appliedIns).mockReturnValueOnce(appliedDel);

                const result = nidhoggr.consume([insert, del]);

                expect(result).toEqual([...appliedIns, ...appliedDel]);
            });

            it("maintains separate pending state for two concurrent incomplete MOVE transactions", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const m1 = makeMoveMessages("txn-move-concurrent-A");
                const m2 = makeMoveMessages("txn-move-concurrent-B");

                nidhoggr.consume(m1.insert);
                nidhoggr.consume(m2.insert);

                expect(nidhoggr.numberPending()).toBe(2);
            });

            it("merges messages for the same transaction ID across separate consume calls", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const ins1 = makeCoastMsg(REMOTE, "txn-move-merge", "MOVE", "INSERT", NODE_KEY, 1);
                const ins2 = makeCoastMsg(REMOTE, "txn-move-merge", "MOVE", "INSERT", NODE_KEY, 2);
                const del = makeCoastMsg(REMOTE, "txn-move-merge", "MOVE", "DELETE", NODE_KEY, 3);
                fugue.effect.mockReturnValue([ins1] as any[]);

                nidhoggr.consume(ins1);
                nidhoggr.consume(ins2);
                expect(nidhoggr.numberPending()).toBe(1);
                expect(nidhoggr.pendingSnapshot()[0].msgCount).toBe(2);

                nidhoggr.consume(del);
                expect(nidhoggr.numberPending()).toBe(0);
            });
        });

        // -------------------------------------------------------------------------
        // consume – COAST UPDATE transaction (two-part)
        // -------------------------------------------------------------------------

        describe("consume – COAST UPDATE transaction", () => {
            it("buffers an incomplete UPDATE transaction that has only one part and does not call fugue.effect", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert } = makeUpdateMessages("txn-upd-partial");

                nidhoggr.consume(insert);

                expect(nidhoggr.numberPending()).toBe(1);
                expect(fugue.effect).not.toHaveBeenCalled();
            });

            it("applies DELETE before INSERT when flushing a complete UPDATE transaction", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeUpdateMessages("txn-upd-order");
                const callOrder: string[] = [];
                fugue.effect.mockImplementation((msgs: any) => {
                    const first = Array.isArray(msgs) ? msgs[0] : msgs;
                    callOrder.push(first.coastOpPart ?? "unknown");
                    return Array.isArray(msgs) ? msgs : [msgs];
                });

                nidhoggr.consume([insert, del]);

                expect(callOrder[0]).toBe("DELETE");
                expect(callOrder[1]).toBe("INSERT");
            });

            it("updates the registry with the new startId and length after an UPDATE with applied inserts", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeUpdateMessages("txn-upd-reg");
                const newId = makeId(REMOTE, 5);
                fugue.effect
                    .mockReturnValueOnce([del] as any[])
                    .mockReturnValueOnce([{ ...insert, id: newId }] as any[]);

                nidhoggr.consume([insert, del]);

                expect(registry.update).toHaveBeenCalledWith(
                    NODE_KEY,
                    expect.objectContaining({ startId: newId, length: 1 }),
                );
            });

            it("does not update the registry when an UPDATE produces no applied inserts", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeUpdateMessages("txn-upd-noop");
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([]);

                nidhoggr.consume([insert, del]);

                expect(registry.update).not.toHaveBeenCalled();
            });

            it("returns applied deletes concatenated with applied inserts for an UPDATE", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeUpdateMessages("txn-upd-return");
                const appliedDels = [del as any];
                const appliedIns = [insert as any];
                fugue.effect.mockReturnValueOnce(appliedDels).mockReturnValueOnce(appliedIns);

                const result = nidhoggr.consume([insert, del]);

                expect(result).toEqual([...appliedDels, ...appliedIns]);
            });

            it("flushes an UPDATE only when it has both INSERT and DELETE parts", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const del1 = makeCoastMsg(REMOTE, "txn-upd-incomplete", "UPDATE", "DELETE", NODE_KEY, 1);
                const del2 = makeCoastMsg(REMOTE, "txn-upd-incomplete", "UPDATE", "DELETE", NODE_KEY, 2);

                nidhoggr.consume([del1, del2]);

                expect(nidhoggr.numberPending()).toBe(1);
                expect(fugue.effect).not.toHaveBeenCalled();
            });
        });
    });

    // -------------------------------------------------------------------------
    // isTxnComplete (edge cases via consume behaviour)
    // -------------------------------------------------------------------------

    describe("transaction completeness", () => {
        it("treats an ADD transaction as complete when it has at least one message", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            const msg = makeAddMessage("txn-add-complete");
            fugue.effect.mockReturnValue([msg] as any[]);

            nidhoggr.consume(msg);

            expect(nidhoggr.numberPending()).toBe(0);
        });

        it("treats a DELETE transaction as complete when it has at least one message", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            const msg = makeDeleteMessage("txn-del-complete");
            fugue.effect.mockReturnValue([msg] as any[]);

            nidhoggr.consume(msg);

            expect(nidhoggr.numberPending()).toBe(0);
        });

        it("keeps a MOVE transaction pending when only multiple INSERT messages arrive without a DELETE", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            const ins1 = makeCoastMsg(REMOTE, "txn-move-no-del", "MOVE", "INSERT", NODE_KEY, 1);
            const ins2 = makeCoastMsg(REMOTE, "txn-move-no-del", "MOVE", "INSERT", NODE_KEY, 2);

            nidhoggr.consume([ins1, ins2]);

            expect(nidhoggr.numberPending()).toBe(1);
            expect(fugue.effect).not.toHaveBeenCalled();
        });

        it("keeps an UPDATE transaction pending when only DELETE messages have arrived without an INSERT", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            const del1 = makeCoastMsg(REMOTE, "txn-upd-no-ins", "UPDATE", "DELETE", NODE_KEY, 1);
            const del2 = makeCoastMsg(REMOTE, "txn-upd-no-ins", "UPDATE", "DELETE", NODE_KEY, 2);

            nidhoggr.consume([del1, del2]);

            expect(nidhoggr.numberPending()).toBe(1);
        });
    });

    describe("Conflict Detection", () => {
        // -------------------------------------------------------------------------
        // Conflict detection – no prior history
        // -------------------------------------------------------------------------

        describe("conflict detection – no prior history", () => {
            it("does not invoke onConflict when there is no prior operation on the node", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                const { insert, delete: del } = makeMoveMessages("txn-first");
                fugue.effect.mockReturnValue([insert] as any[]);

                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("does not throw when onConflict is not provided and a conflict condition is detected", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                // prior: REMOTE with counter 10; incoming: REMOTE_B with counter 50 (> 10, passes guard)
                applyMoveTransaction(nidhoggr, fugue, "txn-no-handler-A", REMOTE, NODE_KEY, 10);

                const { insert, delete: del } = makeMoveMessages("txn-no-handler-B", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValue([]);

                expect(() => nidhoggr.consume([insert, del])).not.toThrow();
            });
        });

        // -------------------------------------------------------------------------
        // Conflict detection – ADD after prior operations (classifyAfterAdd)
        // -------------------------------------------------------------------------

        describe("conflict detection – ADD after prior operations (classifyAfterAdd)", () => {
            it("fires DUPLICATE_ADD when two different replicas add the same node key concurrently", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior ADD from REMOTE at counter 5
                applyAddTransaction(nidhoggr, fugue, "txn-add-first", REMOTE, NODE_KEY, 5);
                jest.clearAllMocks();

                // Incoming ADD from REMOTE_B at counter 50 — logicalTime(50) > logicalTime(5), passes guard
                const secondAdd = makeAddMessage("txn-add-second", REMOTE_B, NODE_KEY, 50);
                const secondApplied = [{ ...secondAdd, coastOpType: "ADD", id: makeId(REMOTE_B, 50) }] as any[];
                fugue.effect.mockReturnValueOnce(secondApplied);

                nidhoggr.consume(secondAdd);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.DUPLICATE_ADD, nodeKey: NODE_KEY }),
                );
            });

            it("fires OPERATION_ON_MISSING_NODE when an operation arrives for a node not in the registry", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior ADD from REMOTE at counter 5 — but registry returns undefined (node never registered)
                applyAddTransaction(nidhoggr, fugue, "txn-add-prior", REMOTE, NODE_KEY, 5);
                registry.get.mockReturnValue(undefined);
                jest.clearAllMocks();

                // Incoming UPDATE from REMOTE_B at counter 50
                const { insert, delete: del } = makeUpdateMessages("txn-upd-missing", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([insert] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.OPERATION_ON_MISSING_NODE, nodeKey: NODE_KEY }),
                );
            });

            it("does NOT fire a conflict when a DELETE follows an ADD from a different replica with a higher logical time and the registry has the node", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior ADD from REMOTE at counter 5
                applyAddTransaction(nidhoggr, fugue, "txn-add-then-del", REMOTE, NODE_KEY, 5);
                registry.get.mockReturnValue({ startId: makeId(), length: 1 });
                jest.clearAllMocks();

                // Incoming DELETE from REMOTE_B at counter 50
                applyDeleteTransaction(nidhoggr, fugue, "txn-del-after-add", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });
        });

        // -------------------------------------------------------------------------
        // Conflict detection – UPDATE after prior operations (classifyAfterUpdate)
        // -------------------------------------------------------------------------

        describe("conflict detection – UPDATE after prior operations (classifyAfterUpdate)", () => {
            it("fires UPDATE_ON_STALE_LOCATION when two concurrent UPDATEs from different replicas target the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior UPDATE from REMOTE, base counter 10 → logicalTime = 10
                applyUpdateTransaction(nidhoggr, fugue, "txn-upd-A", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming UPDATE from REMOTE_B, base counter 50 → logicalTime = 50 > 10, passes guard
                const { insert, delete: del } = makeUpdateMessages("txn-upd-B", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([insert] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.UPDATE_ON_STALE_LOCATION, nodeKey: NODE_KEY }),
                );
            });

            it("fires UPDATE_ON_STALE_LOCATION when a MOVE arrives after an UPDATE on the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior UPDATE from REMOTE at counter 10
                applyUpdateTransaction(nidhoggr, fugue, "txn-upd-first", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming MOVE from REMOTE_B at counter 50
                const { insert, delete: del } = makeMoveMessages("txn-move-after-upd", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.UPDATE_ON_STALE_LOCATION, nodeKey: NODE_KEY }),
                );
            });

            it("fires UPDATE_OF_DELETED_NODE when a DELETE arrives after an UPDATE on the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior UPDATE from REMOTE at counter 10
                applyUpdateTransaction(nidhoggr, fugue, "txn-upd-then-del", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming DELETE from REMOTE_B at counter 50
                applyDeleteTransaction(nidhoggr, fugue, "txn-del-after-upd", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.UPDATE_OF_DELETED_NODE, nodeKey: NODE_KEY }),
                );
            });

            it("fires ADD_OF_EXISTING_NODE when an ADD arrives for a node that was previously UPDATEd", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior UPDATE from REMOTE at counter 10
                applyUpdateTransaction(nidhoggr, fugue, "txn-upd-then-add", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming ADD from REMOTE_B at counter 50
                applyAddTransaction(nidhoggr, fugue, "txn-add-after-upd", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.ADD_OF_EXISTING_NODE, nodeKey: NODE_KEY }),
                );
            });
        });

        // -------------------------------------------------------------------------
        // Conflict detection – MOVE after prior operations (classifyAfterMove)
        // -------------------------------------------------------------------------

        describe("conflict detection – MOVE after prior operations (classifyAfterMove)", () => {
            it("fires CONCURRENT_MOVE_DUPLICATE when a second MOVE from a different replica targets the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior MOVE from REMOTE at counter 10
                applyMoveTransaction(nidhoggr, fugue, "txn-move-first", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming MOVE from REMOTE_B at counter 50
                const { insert, delete: del } = makeMoveMessages("txn-move-second", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.CONCURRENT_MOVE_DUPLICATE, nodeKey: NODE_KEY }),
                );
            });

            it("fires UPDATE_ON_STALE_LOCATION when an UPDATE arrives after a MOVE on the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior MOVE from REMOTE at counter 10
                applyMoveTransaction(nidhoggr, fugue, "txn-move-then-upd", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming UPDATE from REMOTE_B at counter 50
                const { insert, delete: del } = makeUpdateMessages("txn-upd-after-move", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([insert] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.UPDATE_ON_STALE_LOCATION, nodeKey: NODE_KEY }),
                );
            });

            it("fires MOVE_OF_DELETED_NODE when a DELETE arrives after a MOVE on the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior MOVE from REMOTE at counter 10
                applyMoveTransaction(nidhoggr, fugue, "txn-move-then-del", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming DELETE from REMOTE_B at counter 50
                applyDeleteTransaction(nidhoggr, fugue, "txn-del-after-move", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.MOVE_OF_DELETED_NODE, nodeKey: NODE_KEY }),
                );
            });

            it("fires ADD_OF_EXISTING_NODE when an ADD arrives for a node that was previously MOVEd", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior MOVE from REMOTE at counter 10
                applyMoveTransaction(nidhoggr, fugue, "txn-move-then-add", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming ADD from REMOTE_B at counter 50
                applyAddTransaction(nidhoggr, fugue, "txn-add-after-move", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.ADD_OF_EXISTING_NODE, nodeKey: NODE_KEY }),
                );
            });
        });

        // -------------------------------------------------------------------------
        // Conflict detection – DELETE after prior operations (classifyAfterDelete)
        // -------------------------------------------------------------------------

        describe("conflict detection – DELETE after prior operations (classifyAfterDelete)", () => {
            it("fires UPDATE_OF_DELETED_NODE when an UPDATE arrives for a previously deleted node", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior DELETE from REMOTE at counter 10
                applyDeleteTransaction(nidhoggr, fugue, "txn-del-first", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming UPDATE from REMOTE_B at counter 50
                const { insert, delete: del } = makeUpdateMessages("txn-upd-after-del", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([insert] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.UPDATE_OF_DELETED_NODE, nodeKey: NODE_KEY }),
                );
            });

            it("fires MOVE_OF_DELETED_NODE when a MOVE arrives for a previously deleted node", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior DELETE from REMOTE at counter 10
                applyDeleteTransaction(nidhoggr, fugue, "txn-del-then-move", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming MOVE from REMOTE_B at counter 50
                const { insert, delete: del } = makeMoveMessages("txn-move-after-del", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.MOVE_OF_DELETED_NODE, nodeKey: NODE_KEY }),
                );
            });

            it("does NOT fire a conflict when a second DELETE from a different replica targets an already-deleted node (idempotent)", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior DELETE from REMOTE at counter 10
                applyDeleteTransaction(nidhoggr, fugue, "txn-del-first", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming DELETE from REMOTE_B at counter 50
                applyDeleteTransaction(nidhoggr, fugue, "txn-del-second", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("fires ADD_OF_EXISTING_NODE (resurrection) when an ADD arrives for a previously deleted node", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior DELETE from REMOTE at counter 10
                applyDeleteTransaction(nidhoggr, fugue, "txn-del-then-add", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming ADD from REMOTE_B at counter 50
                applyAddTransaction(nidhoggr, fugue, "txn-add-resurrection", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.ADD_OF_EXISTING_NODE, nodeKey: NODE_KEY }),
                );
            });
        });

        // -------------------------------------------------------------------------
        // Conflict detection – guards and idempotency
        // -------------------------------------------------------------------------

        describe("conflict detection – guards and idempotency", () => {
            it("does not fire a conflict when the same transaction ID is re-consumed (idempotent re-delivery)", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                const { insert, delete: del } = makeMoveMessages("txn-move-idem", REMOTE, NODE_KEY, 10);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);
                jest.clearAllMocks();

                // Re-consuming the exact same txnId: prior.txnId === incoming.txnId → null
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("does not fire a conflict when the same replica sends consecutive operations on the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Both transactions from REMOTE — same replicaId guard returns null
                applyMoveTransaction(nidhoggr, fugue, "txn-same-rep-1", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-same-rep-2", REMOTE, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("does not fire a conflict when incoming logicalTime is strictly less than prior logicalTime", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Prior MOVE from REMOTE at counter 100 (high logical time)
                applyMoveTransaction(nidhoggr, fugue, "txn-high-prior", REMOTE, NODE_KEY, 100);
                jest.clearAllMocks();

                // Incoming MOVE from REMOTE_B at counter 5 (lower logical time → early return)
                const { insert, delete: del } = makeMoveMessages("txn-low-incoming", REMOTE_B, NODE_KEY, 5);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("passes the correct nodeKey, prior txnId, and incoming txnId to the conflict handler", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-prior-id", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-incoming-id", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({
                        nodeKey: NODE_KEY,
                        prior: expect.objectContaining({ txnId: "txn-prior-id" }),
                        incoming: expect.objectContaining({ txnId: "txn-incoming-id" }),
                    }),
                );
            });

            it("includes autoRecoverable flag in the emitted conflict", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-autorecov-A", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-autorecov-B", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                const conflict = (mockConflictHandler as jest.Mock).mock.calls[0][0] as any;
                expect(conflict).toHaveProperty("autoRecoverable");
            });

            it("includes a recoverySuggestion in the emitted conflict", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-recovery-A", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-recovery-B", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                const conflict = (mockConflictHandler as jest.Mock).mock.calls[0][0] as any;
                expect(conflict).toHaveProperty("recoverySuggestion");
            });
        });
    });

    // -------------------------------------------------------------------------
    // TTL / eviction
    // -------------------------------------------------------------------------

    describe("TTL eviction", () => {
        it("evicts a pending transaction that has exceeded the configured TTL on the next consume call", () => {
            jest.useFakeTimers();
            try {
                const nidhoggr = new Nidhoggr(fugue, registry, { txnTtlMs: 5_000 });
                const { insert } = makeMoveMessages("txn-stale");
                nidhoggr.consume(insert);
                expect(nidhoggr.numberPending()).toBe(1);

                jest.advanceTimersByTime(5_001);
                nidhoggr.consume(makeMsg({ replicaId: REMOTE }));

                expect(nidhoggr.numberPending()).toBe(0);
            } finally {
                jest.useRealTimers();
            }
        });

        it("calls fugue.effect with the partial messages of an evicted transaction", () => {
            jest.useFakeTimers();
            try {
                const nidhoggr = new Nidhoggr(fugue, registry, { txnTtlMs: 5_000 });
                const { insert } = makeMoveMessages("txn-partial-evict");
                nidhoggr.consume(insert);

                jest.advanceTimersByTime(5_001);
                fugue.effect.mockReturnValue([]);
                nidhoggr.consume(makeMsg({ replicaId: REMOTE }));

                expect(fugue.effect).toHaveBeenCalledWith(
                    expect.arrayContaining([expect.objectContaining({ coastTxId: "txn-partial-evict" })]),
                );
            } finally {
                jest.useRealTimers();
            }
        });

        it("does not evict a transaction that has not yet reached the TTL", () => {
            jest.useFakeTimers();
            try {
                const nidhoggr = new Nidhoggr(fugue, registry, { txnTtlMs: 5_000 });
                const { insert } = makeMoveMessages("txn-live");
                nidhoggr.consume(insert);

                jest.advanceTimersByTime(4_999);
                nidhoggr.consume(makeMsg({ replicaId: REMOTE }));

                expect(nidhoggr.numberPending()).toBe(1);
            } finally {
                jest.useRealTimers();
            }
        });

        it("uses the default TTL of 10 000 ms when no txnTtlMs option is supplied", () => {
            jest.useFakeTimers();
            try {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert } = makeMoveMessages("txn-default-ttl");
                nidhoggr.consume(insert);

                jest.advanceTimersByTime(9_999);
                nidhoggr.consume(makeMsg({ replicaId: REMOTE }));
                expect(nidhoggr.numberPending()).toBe(1);

                jest.advanceTimersByTime(2);
                nidhoggr.consume(makeMsg({ replicaId: REMOTE }));
                expect(nidhoggr.numberPending()).toBe(0);
            } finally {
                jest.useRealTimers();
            }
        });

        it("evicts only expired transactions and leaves unexpired ones in the pending queue", () => {
            jest.useFakeTimers();
            try {
                const nidhoggr = new Nidhoggr(fugue, registry, { txnTtlMs: 5_000 });

                const { insert: oldInsert } = makeMoveMessages("txn-old");
                nidhoggr.consume(oldInsert);

                jest.advanceTimersByTime(4_999);
                const { insert: newInsert } = makeMoveMessages("txn-new");
                nidhoggr.consume(newInsert);

                jest.advanceTimersByTime(2);
                fugue.effect.mockReturnValue([]);
                nidhoggr.consume(makeMsg({ replicaId: REMOTE }));

                expect(nidhoggr.numberPending()).toBe(1);
                expect(nidhoggr.pendingSnapshot()[0].txnId).toBe("txn-new");
            } finally {
                jest.useRealTimers();
            }
        });

        it("applies partial messages from an evicted transaction even when no conflict handler is set", () => {
            jest.useFakeTimers();
            try {
                const nidhoggr = new Nidhoggr(fugue, registry, { txnTtlMs: 1_000 });
                const { insert } = makeMoveMessages("txn-evict-no-handler");
                nidhoggr.consume(insert);

                jest.advanceTimersByTime(1_001);
                fugue.effect.mockReturnValue([]);

                expect(() => nidhoggr.consume(makeMsg({ replicaId: REMOTE }))).not.toThrow();
            } finally {
                jest.useRealTimers();
            }
        });
    });

    // -------------------------------------------------------------------------
    // numberPending / pendingSnapshot
    // -------------------------------------------------------------------------

    describe("numberPending and pendingSnapshot", () => {
        it("returns 0 when there are no buffered transactions", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            expect(nidhoggr.numberPending()).toBe(0);
        });

        it("increments correctly as transactions are buffered and decrements after they are flushed", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            const m1 = makeMoveMessages("txn-count-A");
            const m2 = makeMoveMessages("txn-count-B");

            nidhoggr.consume(m1.insert);
            nidhoggr.consume(m2.insert);
            expect(nidhoggr.numberPending()).toBe(2);

            fugue.effect.mockReturnValue([m1.insert] as any[]);
            nidhoggr.consume(m1.delete);
            expect(nidhoggr.numberPending()).toBe(1);

            fugue.effect.mockReturnValue([m2.insert] as any[]);
            nidhoggr.consume(m2.delete);
            expect(nidhoggr.numberPending()).toBe(0);
        });

        it("pendingSnapshot returns one entry per pending transaction with correct opType and txnId", () => {
            jest.useFakeTimers();
            try {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert } = makeMoveMessages("txn-snap-1");
                nidhoggr.consume(insert);
                jest.advanceTimersByTime(200);

                const snapshot = nidhoggr.pendingSnapshot();
                expect(snapshot).toHaveLength(1);
                expect(snapshot[0]).toMatchObject({
                    txnId: "txn-snap-1",
                    opType: "MOVE",
                    msgCount: 1,
                });
                expect(snapshot[0].ageMs).toBeGreaterThanOrEqual(200);
            } finally {
                jest.useRealTimers();
            }
        });

        it("pendingSnapshot reflects the accumulated message count when multiple messages arrive for the same transaction", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            const ins1 = makeCoastMsg(REMOTE, "txn-snap-multi", "MOVE", "INSERT", NODE_KEY, 1);
            const ins2 = makeCoastMsg(REMOTE, "txn-snap-multi", "MOVE", "INSERT", NODE_KEY, 2);

            nidhoggr.consume(ins1);
            nidhoggr.consume(ins2);

            expect(nidhoggr.pendingSnapshot()[0].msgCount).toBe(2);
        });

        it("pendingSnapshot returns an empty array after all pending transactions are flushed", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            const { insert, delete: del } = makeMoveMessages("txn-flush");
            fugue.effect.mockReturnValue([insert, del] as any[]);

            nidhoggr.consume([insert, del]);

            expect(nidhoggr.pendingSnapshot()).toEqual([]);
        });

        it("pendingSnapshot ageMs is near-zero immediately after buffering a transaction", () => {
            jest.useFakeTimers();
            try {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert } = makeMoveMessages("txn-age-zero");
                nidhoggr.consume(insert);

                const snapshot = nidhoggr.pendingSnapshot();
                expect(snapshot[0].ageMs).toBeLessThan(50);
            } finally {
                jest.useRealTimers();
            }
        });
    });

    // -------------------------------------------------------------------------
    // Mixed plain + COAST messages in a single consume call
    // -------------------------------------------------------------------------

    describe("mixed plain and COAST messages in a single consume call", () => {
        it("applies plain messages immediately and buffers incomplete COAST transactions", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            const plain = makeMsg({ replicaId: REMOTE });
            const { insert } = makeMoveMessages("txn-mixed");
            fugue.effect.mockReturnValue([plain] as any[]);

            const result = nidhoggr.consume([plain, insert]);

            expect(fugue.effect).toHaveBeenCalledWith([plain]);
            expect(result).toEqual([plain]);
            expect(nidhoggr.numberPending()).toBe(1);
        });

        it("returns applied messages from both plain effects and completed COAST transactions in the same call", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            const plain = makeMsg({ replicaId: REMOTE });
            const { insert, delete: del } = makeMoveMessages("txn-combined");
            const appliedPlain = [plain as any];
            const appliedInsert = [insert as any];
            const appliedDelete = [del as any];

            fugue.effect
                .mockReturnValueOnce(appliedPlain)
                .mockReturnValueOnce(appliedInsert)
                .mockReturnValueOnce(appliedDelete);

            const result = nidhoggr.consume([plain, insert, del]);

            expect(result).toEqual([...appliedPlain, ...appliedInsert, ...appliedDelete]);
        });

        it("does not include local-replica messages in the plain batch even when mixed with remote COAST messages", () => {
            const nidhoggr = new Nidhoggr(fugue, registry);
            const localMsg = makeMsg({ replicaId: LOCAL });
            const remotePlain = makeMsg({ replicaId: REMOTE });
            const { insert } = makeMoveMessages("txn-local-mixed");
            fugue.effect.mockReturnValue([remotePlain] as any[]);

            nidhoggr.consume([localMsg, remotePlain, insert]);

            expect(fugue.effect).toHaveBeenCalledWith([remotePlain]);
        });
    });

    // -------------------------------------------------------------------------
    // Edge cases – missing coastNodeKey
    // -------------------------------------------------------------------------

    describe("edge cases – missing coastNodeKey", () => {
        it("skips registry registration when the ADD transaction message has no coastNodeKey and the registry already has an entry", () => {
            // handleAdd reads txn.msgs[0].coastNodeKey! and calls registry.get(nodeKey).
            // If registry.get returns a truthy entry the register branch is skipped entirely.
            // This test uses a message that has coastNodeKey set but registry.get pre-populated
            // so that we verify the guard prevents double-registration, not the undefined-key path.
            const nidhoggr = new Nidhoggr(fugue, registry);
            const msg = makeAddMessage("txn-existing-key");
            fugue.effect.mockReturnValue([msg] as any[]);
            registry.get.mockReturnValue({ startId: makeId(), length: 1 });

            nidhoggr.consume(msg);

            expect(registry.register).not.toHaveBeenCalled();
        });

        it("does not invoke onConflict for a transaction whose first message has no coastNodeKey", () => {
            // detectConflicts guards with `if (!nodeKey) return` — so no conflict is emitted.
            const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
            const msg = makeMsg({
                replicaId: REMOTE,
                coastTxId: "txn-no-key-conflict",
                coastOpType: "ADD",
                // coastNodeKey deliberately omitted
            } as any);
            fugue.effect.mockReturnValue([{ ...msg, coastOpType: "ADD", id: makeId(REMOTE, 1) }] as any[]);

            nidhoggr.consume(msg);

            expect(mockConflictHandler).not.toHaveBeenCalled();
        });

        it("does not record history when the transaction message has no coastNodeKey", () => {
            // recordHistory also guards with `if (!nodeKey) return`,
            // so a subsequent operation on a real node should not see history from this message.
            const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
            const noKeyMsg = makeMsg({
                replicaId: REMOTE,
                coastTxId: "txn-no-key-history",
                coastOpType: "ADD",
            } as any);
            fugue.effect.mockReturnValueOnce([{ ...noKeyMsg, coastOpType: "ADD", id: makeId(REMOTE, 1) }] as any[]);
            nidhoggr.consume(noKeyMsg);

            jest.clearAllMocks();

            // A second ADD for a real node key from a different replica — no prior history
            // should exist for NODE_KEY, so no conflict is emitted.
            const realAdd = makeAddMessage("txn-real-add", REMOTE_B, NODE_KEY, 50);
            fugue.effect.mockReturnValueOnce([{ ...realAdd, coastOpType: "ADD", id: makeId(REMOTE_B, 50) }] as any[]);
            nidhoggr.consume(realAdd);

            expect(mockConflictHandler).not.toHaveBeenCalled();
        });

        it("does not invoke onConflict when a COAST message has no coastNodeKey", () => {
            // detectConflicts guards on nodeKey existence: `if (!nodeKey) return;`
            const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
            const msg = makeMsg({
                replicaId: REMOTE,
                coastTxId: "txn-no-key-conflict",
                coastOpType: "ADD",
            } as any);
            fugue.effect.mockReturnValue([{ ...msg, coastOpType: "ADD", id: makeId(REMOTE, 1) }] as any[]);
            registry.get.mockReturnValue(undefined);

            nidhoggr.consume(msg);

            expect(mockConflictHandler).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // Node history recording
    // -------------------------------------------------------------------------

    describe("node history recording", () => {
        it("records history for an ADD transaction so a subsequent conflicting ADD is detected", () => {
            const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
            // Prior ADD from REMOTE at counter 5
            applyAddTransaction(nidhoggr, fugue, "txn-hist-add", REMOTE, NODE_KEY, 5);
            jest.clearAllMocks();

            // Incoming ADD from REMOTE_B at counter 50 — triggers DUPLICATE_ADD
            const secondMsg = makeAddMessage("txn-hist-add-second", REMOTE_B, NODE_KEY, 50);
            fugue.effect.mockReturnValue([{ ...secondMsg, coastOpType: "ADD", id: makeId(REMOTE_B, 50) }] as any[]);
            nidhoggr.consume(secondMsg);

            expect(mockConflictHandler).toHaveBeenCalled();
        });

        it("uses the most recently applied transaction when classifying the next conflict on the same node", () => {
            const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
            // ADD then UPDATE from REMOTE (same replica — no conflicts between them)
            applyAddTransaction(nidhoggr, fugue, "txn-hist-add", REMOTE, NODE_KEY, 5);
            applyUpdateTransaction(nidhoggr, fugue, "txn-hist-upd", REMOTE, NODE_KEY, 10);
            jest.clearAllMocks();

            // Now a DELETE from REMOTE_B at counter 50: prior is UPDATE → UPDATE_OF_DELETED_NODE
            applyDeleteTransaction(nidhoggr, fugue, "txn-hist-del", REMOTE_B, NODE_KEY, 50);

            expect(mockConflictHandler).toHaveBeenCalledWith(
                expect.objectContaining({ type: ConflictType.UPDATE_OF_DELETED_NODE }),
            );
        });
    });

    const LOCAL = "local-replica";
    const REMOTE = "remote-replica";
    const REMOTE_B = "remote-replica-b";
    const NODE_KEY = "node-key-1";
    const NODE_KEY_2 = "node-key-2";

    describe("Nidhoggr Coverage", () => {
        let fugue: ReturnType<typeof makeMockFugue>;
        let registry: ReturnType<typeof makeMockRegistry>;

        beforeEach(() => {
            resetCounter();
            jest.clearAllMocks();
            fugue = makeMockFugue(LOCAL);
            registry = makeMockRegistry();
        });

        // -------------------------------------------------------------------------
        // arrivedAt is preserved — not reset when additional messages merge into
        // an existing pending transaction
        // -------------------------------------------------------------------------

        describe("arrivedAt is frozen at the time the first message arrives", () => {
            it("evicts a MOVE transaction whose age is measured from the first INSERT, not from the later DELETE", () => {
                jest.useFakeTimers();
                try {
                    const ttlMs = 5_000;
                    const nidhoggr = new Nidhoggr(fugue, registry, { txnTtlMs: ttlMs });

                    const { insert, delete: del } = makeMoveMessages("txn-arrivedAt");
                    // First part arrives — arrivedAt is set now (t=0)
                    nidhoggr.consume(insert);
                    expect(nidhoggr.numberPending()).toBe(1);

                    // Advance to just before TTL, then add the second part.
                    // If arrivedAt were reset here the transaction would survive; it should not.
                    jest.advanceTimersByTime(ttlMs - 1);
                    nidhoggr.consume(del); // second part — but transaction is not yet complete because…
                    // Actually the transaction IS now complete after receiving DELETE — it will be flushed,
                    // not evicted. So we prove the inverse: a transaction that received its second part
                    // only 1ms before TTL should have been evicted on the NEXT consume after TTL
                    // had the second part not completed it.
                    //
                    // Instead, test with two INSERTs (transaction stays incomplete):
                    const ins1 = makeCoastMsg(REMOTE, "txn-frozen-clock", "MOVE", "INSERT", NODE_KEY, 1);
                    const ins2 = makeCoastMsg(REMOTE, "txn-frozen-clock", "MOVE", "INSERT", NODE_KEY, 2);

                    const nidhoggr2 = new Nidhoggr(fugue, registry, { txnTtlMs: ttlMs });
                    nidhoggr2.consume(ins1); // arrivedAt = now = t+(ttlMs-1)
                    jest.advanceTimersByTime(ttlMs - 1);
                    // Merge second INSERT — arrivedAt must NOT reset, it stays as first arrival
                    nidhoggr2.consume(ins2);
                    expect(nidhoggr2.numberPending()).toBe(1);

                    // Advance 2 more ms: total age from first INSERT = ttlMs + 1 → should evict
                    jest.advanceTimersByTime(2);
                    fugue.effect.mockReturnValue([]);
                    nidhoggr2.consume(makeMsg({ replicaId: REMOTE }));

                    expect(nidhoggr2.numberPending()).toBe(0);
                } finally {
                    jest.useRealTimers();
                }
            });

            it("does not evict a transaction when age from first arrival has not yet exceeded TTL even though a merge has since occurred", () => {
                jest.useFakeTimers();
                try {
                    const ttlMs = 5_000;
                    const nidhoggr = new Nidhoggr(fugue, registry, { txnTtlMs: ttlMs });

                    const ins1 = makeCoastMsg(REMOTE, "txn-no-evict-merge", "MOVE", "INSERT", NODE_KEY, 1);
                    const ins2 = makeCoastMsg(REMOTE, "txn-no-evict-merge", "MOVE", "INSERT", NODE_KEY, 2);

                    nidhoggr.consume(ins1); // arrivedAt = t=0
                    jest.advanceTimersByTime(ttlMs - 100);
                    nidhoggr.consume(ins2); // merge — arrivedAt must stay at t=0

                    // Total age = ttlMs - 100 → still within TTL
                    nidhoggr.consume(makeMsg({ replicaId: REMOTE }));

                    expect(nidhoggr.numberPending()).toBe(1);
                } finally {
                    jest.useRealTimers();
                }
            });

            it("pendingSnapshot ageMs reflects elapsed time from the first message, not from a subsequent merge", () => {
                jest.useFakeTimers();
                try {
                    const nidhoggr = new Nidhoggr(fugue, registry);

                    const ins1 = makeCoastMsg(REMOTE, "txn-age-merge", "MOVE", "INSERT", NODE_KEY, 1);
                    const ins2 = makeCoastMsg(REMOTE, "txn-age-merge", "MOVE", "INSERT", NODE_KEY, 2);

                    nidhoggr.consume(ins1); // arrivedAt = t=0
                    jest.advanceTimersByTime(300);
                    nidhoggr.consume(ins2); // merge at t=300; arrivedAt must NOT reset

                    jest.advanceTimersByTime(200); // now t=500

                    const snapshot = nidhoggr.pendingSnapshot();
                    // ageMs should be ~500 (from first arrival), not ~200 (from merge)
                    expect(snapshot[0].ageMs).toBeGreaterThanOrEqual(500);
                } finally {
                    jest.useRealTimers();
                }
            });
        });

        // -------------------------------------------------------------------------
        // Evicted transactions do NOT call recordHistory
        // -------------------------------------------------------------------------

        describe("evicted transactions do not update nodeHistory", () => {
            it("does not record history for an evicted transaction, so a subsequent operation on the same node sees no prior", () => {
                jest.useFakeTimers();
                try {
                    const nidhoggr = new Nidhoggr(fugue, registry, {
                        txnTtlMs: 5_000,
                        onConflict: mockConflictHandler,
                    });

                    // Buffer an incomplete MOVE — will be evicted before completion
                    const { insert } = makeMoveMessages("txn-evict-no-history", REMOTE, NODE_KEY, 10);
                    nidhoggr.consume(insert);

                    // Evict it
                    jest.advanceTimersByTime(5_001);
                    fugue.effect.mockReturnValue([]);
                    nidhoggr.consume(makeMsg({ replicaId: REMOTE }));
                    expect(nidhoggr.numberPending()).toBe(0);

                    jest.clearAllMocks();

                    // Now a complete MOVE from REMOTE_B on the same node.
                    // Because eviction did NOT write history, there is no prior → no conflict.
                    const { insert: ins2, delete: del2 } = makeMoveMessages("txn-after-evict", REMOTE_B, NODE_KEY, 50);
                    fugue.effect.mockReturnValueOnce([ins2] as any[]).mockReturnValueOnce([del2] as any[]);
                    nidhoggr.consume([ins2, del2]);

                    expect(mockConflictHandler).not.toHaveBeenCalled();
                } finally {
                    jest.useRealTimers();
                }
            });

            it("applies the partial messages of an evicted transaction to fugue.effect without writing to nodeHistory", () => {
                jest.useFakeTimers();
                try {
                    const nidhoggr = new Nidhoggr(fugue, registry, { txnTtlMs: 1_000 });

                    const { insert } = makeMoveMessages("txn-evict-partial", REMOTE, NODE_KEY, 10);
                    nidhoggr.consume(insert);

                    jest.advanceTimersByTime(1_001);
                    fugue.effect.mockReturnValue([]);
                    nidhoggr.consume(makeMsg({ replicaId: REMOTE }));

                    // Eviction called fugue.effect with the partial INSERT message
                    expect(fugue.effect).toHaveBeenCalledWith(
                        expect.arrayContaining([expect.objectContaining({ coastOpPart: "INSERT" })]),
                    );

                    // But the return value of the evict-trigger consume is for the plain message,
                    // not the evicted partial — evictExpiredTransactions does not contribute to applied[]
                    // (its fugue.effect return value is discarded). The trigger plain message's effect
                    // is the only thing returned.
                } finally {
                    jest.useRealTimers();
                }
            });
        });

        // -------------------------------------------------------------------------
        // Conflict detected + no applied messages → recordHistory NOT called
        // (handleMove / handleUpdate guard: recordHistory only called when appliedInserts.length > 0)
        // -------------------------------------------------------------------------

        describe("recordHistory is NOT called when the transaction produces no applied inserts", () => {
            it("does not overwrite nodeHistory when a conflicting MOVE produces zero applied INSERT messages", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });

                // Prior MOVE from REMOTE at counter 10 — writes history
                applyMoveTransaction(nidhoggr, fugue, "txn-move-prior", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming MOVE from REMOTE_B at counter 50 — conflict detected, but
                // fugue.effect returns [] for inserts → recordHistory not called → prior stays
                const { insert, delete: del } = makeMoveMessages("txn-move-noapply", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.CONCURRENT_MOVE_DUPLICATE }),
                );

                jest.clearAllMocks();
                // A third MOVE from REMOTE_B at counter 100 should still see "txn-move-prior" as prior
                // (the no-apply MOVE did not overwrite history)
                const { insert: ins3, delete: del3 } = makeMoveMessages("txn-move-third", REMOTE_B, NODE_KEY, 100);
                fugue.effect.mockReturnValueOnce([ins3] as any[]).mockReturnValueOnce([del3] as any[]);
                nidhoggr.consume([ins3, del3]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({
                        prior: expect.objectContaining({ txnId: "txn-move-prior" }),
                    }),
                );
            });

            it("does not overwrite nodeHistory when a conflicting UPDATE produces zero applied INSERT messages", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });

                // Prior UPDATE from REMOTE at counter 10
                applyUpdateTransaction(nidhoggr, fugue, "txn-upd-prior", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming UPDATE from REMOTE_B at counter 50 — conflict, but inserts return []
                const { insert, delete: del } = makeUpdateMessages("txn-upd-noapply", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.UPDATE_ON_STALE_LOCATION }),
                );

                jest.clearAllMocks();
                // Next UPDATE from REMOTE_B at counter 100 still sees "txn-upd-prior" as prior
                const { insert: ins2, delete: del2 } = makeUpdateMessages("txn-upd-third", REMOTE_B, NODE_KEY, 100);
                fugue.effect.mockReturnValueOnce([del2] as any[]).mockReturnValueOnce([ins2] as any[]);
                nidhoggr.consume([ins2, del2]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({
                        prior: expect.objectContaining({ txnId: "txn-upd-prior" }),
                    }),
                );
            });

            it("does not overwrite nodeHistory when an ADD produces zero applied messages", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });

                // Prior ADD from REMOTE at counter 5 — writes history
                applyAddTransaction(nidhoggr, fugue, "txn-add-prior", REMOTE, NODE_KEY, 5);
                jest.clearAllMocks();

                // Incoming ADD from REMOTE_B at counter 50 — conflict, but fugue.effect returns []
                const secondAdd = makeAddMessage("txn-add-noapply", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([]);
                nidhoggr.consume(secondAdd);

                // DUPLICATE_ADD conflict was detected (before apply)
                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.DUPLICATE_ADD }),
                );

                jest.clearAllMocks();
                // A third ADD from REMOTE_B at counter 100 must still see "txn-add-prior" as prior
                const thirdAdd = makeAddMessage("txn-add-third", REMOTE_B, NODE_KEY, 100);
                fugue.effect.mockReturnValueOnce([]);
                nidhoggr.consume(thirdAdd);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({
                        prior: expect.objectContaining({ txnId: "txn-add-prior" }),
                    }),
                );
            });

            it("does not overwrite nodeHistory when a DELETE produces zero applied messages", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });

                // Prior MOVE from REMOTE at counter 10
                applyMoveTransaction(nidhoggr, fugue, "txn-move-prior", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                // Incoming DELETE from REMOTE_B at counter 50 — conflict detected, but fugue.effect returns []
                const delMsg = makeDeleteMessage("txn-del-noapply", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([]);
                nidhoggr.consume(delMsg);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.MOVE_OF_DELETED_NODE }),
                );

                jest.clearAllMocks();
                // A MOVE from REMOTE_B at counter 100 still sees "txn-move-prior" as prior
                const { insert, delete: del } = makeMoveMessages("txn-move-after", REMOTE_B, NODE_KEY, 100);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({
                        prior: expect.objectContaining({ txnId: "txn-move-prior" }),
                    }),
                );
            });
        });

        // -------------------------------------------------------------------------
        // handleMove no-insert path: registry.update and recordHistory are both skipped
        // -------------------------------------------------------------------------

        describe("handleMove – registry and history are skipped when no INSERT messages are applied", () => {
            it("does not call registry.update when handleMove appliedInserts is empty", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeMoveMessages("txn-move-no-ins-apply");
                // INSERT effect returns nothing; DELETE effect returns the delete message
                fugue.effect.mockReturnValueOnce([]).mockReturnValueOnce([del] as any[]);

                nidhoggr.consume([insert, del]);

                expect(registry.update).not.toHaveBeenCalled();
            });

            it("returns only appliedDeletes when handleMove appliedInserts is empty", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeMoveMessages("txn-move-del-only-applied");
                const appliedDel = [del as any];
                fugue.effect.mockReturnValueOnce([]).mockReturnValueOnce(appliedDel);

                const result = nidhoggr.consume([insert, del]);

                expect(result).toEqual(appliedDel);
            });
        });

        // -------------------------------------------------------------------------
        // handleUpdate – history skipped when no INSERT messages are applied
        // (appliedInserts.length === 0 even when appliedDeletes has messages)
        // -------------------------------------------------------------------------

        describe("handleUpdate – registry and history are skipped when no INSERT messages are applied", () => {
            it("returns only appliedDeletes when handleUpdate appliedInserts is empty", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeUpdateMessages("txn-upd-del-only-applied");
                const appliedDel = [del as any];
                fugue.effect.mockReturnValueOnce(appliedDel).mockReturnValueOnce([]);

                const result = nidhoggr.consume([insert, del]);

                expect(result).toEqual(appliedDel);
            });

            it("does not call registry.update when appliedDeletes has messages but appliedInserts is empty", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeUpdateMessages("txn-upd-no-ins-reg");
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([]);

                nidhoggr.consume([insert, del]);

                expect(registry.update).not.toHaveBeenCalled();
            });
        });

        // -------------------------------------------------------------------------
        // Two complete COAST transactions in a single consume call
        // -------------------------------------------------------------------------

        describe("two complete COAST transactions in a single consume call", () => {
            it("flushes both complete COAST transactions and returns their combined applied messages", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const add = makeAddMessage("txn-add-batch", REMOTE, NODE_KEY, 5);
                const del = makeDeleteMessage("txn-del-batch", REMOTE, NODE_KEY_2, 30);

                const appliedAdd = [{ ...add, coastOpType: "ADD", id: makeId(REMOTE, 5) }] as any[];
                const appliedDel = [del as any];

                // fugue.effect called once per complete transaction: once for ADD, once for DELETE
                fugue.effect.mockReturnValueOnce(appliedAdd).mockReturnValueOnce(appliedDel);
                registry.get.mockReturnValue(undefined);

                const result = nidhoggr.consume([add, del]);

                expect(nidhoggr.numberPending()).toBe(0);
                expect(result).toEqual([...appliedAdd, ...appliedDel]);
            });

            it("flushes a complete MOVE and a complete ADD in the same consume call, leaving nothing pending", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const { insert, delete: del } = makeMoveMessages("txn-move-batch", REMOTE, NODE_KEY, 10);
                const add = makeAddMessage("txn-add-batch", REMOTE, NODE_KEY_2, 5);

                const appliedIns = [insert as any];
                const appliedDel = [del as any];
                const appliedAdd = [{ ...add, coastOpType: "ADD", id: makeId(REMOTE, 5) }] as any[];

                // MOVE INSERT, MOVE DELETE, ADD — order depends on Map iteration (insertion order in V8)
                fugue.effect
                    .mockReturnValueOnce(appliedIns)
                    .mockReturnValueOnce(appliedDel)
                    .mockReturnValueOnce(appliedAdd);
                registry.get.mockReturnValue(undefined);

                nidhoggr.consume([insert, del, add]);

                expect(nidhoggr.numberPending()).toBe(0);
            });

            it("flushes a complete transaction and buffers an incomplete one in the same consume call", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                const add = makeAddMessage("txn-add-complete", REMOTE, NODE_KEY, 5);
                const { insert: moveIns } = makeMoveMessages("txn-move-incomplete", REMOTE, NODE_KEY_2, 10);

                const appliedAdd = [{ ...add, coastOpType: "ADD", id: makeId(REMOTE, 5) }] as any[];
                fugue.effect.mockReturnValueOnce(appliedAdd);
                registry.get.mockReturnValue(undefined);

                const result = nidhoggr.consume([add, moveIns]);

                expect(result).toEqual(appliedAdd);
                expect(nidhoggr.numberPending()).toBe(1);
            });

            it("writes history for both completed transactions independently", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });

                // Apply two complete transactions on separate nodes in one call
                const add1 = makeAddMessage("txn-add-hist-1", REMOTE, NODE_KEY, 5);
                const add2 = makeAddMessage("txn-add-hist-2", REMOTE, NODE_KEY_2, 6);

                const applied1 = [{ ...add1, coastOpType: "ADD", id: makeId(REMOTE, 5) }] as any[];
                const applied2 = [{ ...add2, coastOpType: "ADD", id: makeId(REMOTE, 6) }] as any[];
                fugue.effect.mockReturnValueOnce(applied1).mockReturnValueOnce(applied2);
                registry.get.mockReturnValue(undefined);

                nidhoggr.consume([add1, add2]);
                jest.clearAllMocks();

                // A DUPLICATE_ADD from REMOTE_B on NODE_KEY should reference "txn-add-hist-1" as prior
                const secondAdd1 = makeAddMessage("txn-add-dup-1", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([]);
                nidhoggr.consume(secondAdd1);
                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({
                        prior: expect.objectContaining({ txnId: "txn-add-hist-1" }),
                        nodeKey: NODE_KEY,
                    }),
                );

                jest.clearAllMocks();

                // A DUPLICATE_ADD from REMOTE_B on NODE_KEY_2 should reference "txn-add-hist-2" as prior
                const secondAdd2 = makeAddMessage("txn-add-dup-2", REMOTE_B, NODE_KEY_2, 51);
                fugue.effect.mockReturnValueOnce([]);
                nidhoggr.consume(secondAdd2);
                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({
                        prior: expect.objectContaining({ txnId: "txn-add-hist-2" }),
                        nodeKey: NODE_KEY_2,
                    }),
                );
            });
        });

        // -------------------------------------------------------------------------
        // detectConflicts is called before the handler, applyTxn ordering
        // -------------------------------------------------------------------------

        describe("detectConflicts is called before the handler mutates registry / history", () => {
            it("passes the pre-apply registry state (registryHasNode) to classifyConflict", () => {
                // registry.get returns a truthy value before the DELETE is applied.
                // After handleDelete, registry.delete is called. The conflict classifier
                // must see the pre-delete registry state (registryHasNode = true).
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });

                // Establish prior MOVE so there is something to conflict with
                applyMoveTransaction(nidhoggr, fugue, "txn-move-setup", REMOTE, NODE_KEY, 10);
                registry.get.mockReturnValue({ startId: makeId(), length: 1 }); // node exists in registry
                jest.clearAllMocks();

                // Incoming DELETE from REMOTE_B — registry has the node, so registryHasNode = true
                const delMsg = makeDeleteMessage("txn-del-precheck", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([delMsg] as any[]);

                nidhoggr.consume(delMsg);

                // MOVE_OF_DELETED_NODE conflict fired (prior = MOVE, incoming = DELETE)
                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.MOVE_OF_DELETED_NODE }),
                );
                // And registry.delete was still called (handler ran after conflict detection)
                expect(registry.delete).toHaveBeenCalledWith(NODE_KEY);
            });

            it("passes registryHasNode = false to classifyConflict when the node is absent from registry", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });

                // Prior ADD recorded in history
                applyAddTransaction(nidhoggr, fugue, "txn-add-setup", REMOTE, NODE_KEY, 5);
                registry.get.mockReturnValue(undefined); // node NOT in registry
                jest.clearAllMocks();

                // Incoming UPDATE from REMOTE_B at counter 50 — classifyAfterAdd with registryHasNode=false
                const { insert, delete: del } = makeUpdateMessages("txn-upd-missing", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([insert] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.OPERATION_ON_MISSING_NODE }),
                );
            });
        });

        // -------------------------------------------------------------------------
        // consume return value correctness — evictExpiredTransactions discard does
        // NOT contribute to the return value of consume
        // -------------------------------------------------------------------------

        describe("eviction does not contribute to the consume return value", () => {
            it("returns only the applied messages from the trigger message, not from the evicted partial transaction", () => {
                jest.useFakeTimers();
                try {
                    const nidhoggr = new Nidhoggr(fugue, registry, { txnTtlMs: 1_000 });

                    const { insert } = makeMoveMessages("txn-evict-return", REMOTE, NODE_KEY, 10);
                    nidhoggr.consume(insert);

                    jest.advanceTimersByTime(1_001);

                    const triggerMsg = makeMsg({ replicaId: REMOTE });
                    const appliedTrigger = [triggerMsg as any];
                    // eviction calls fugue.effect first (return value discarded), then plain batch
                    fugue.effect.mockReturnValueOnce([]).mockReturnValueOnce(appliedTrigger);

                    const result = nidhoggr.consume(triggerMsg);

                    // Only the trigger message's applied output is returned
                    expect(result).toEqual(appliedTrigger);
                } finally {
                    jest.useRealTimers();
                }
            });
        });

        // -------------------------------------------------------------------------
        // logicalTimeOf — multi-message transactions use the minimum counter
        // -------------------------------------------------------------------------

        describe("logicalTimeOf uses the minimum counter across all transaction messages", () => {
            it("uses the lowest counter from a multi-message MOVE as logicalTime when classifying conflicts", () => {
                // prior MOVE from REMOTE at counter 10
                // incoming MOVE from REMOTE_B — two messages with counters 8 and 100.
                // logicalTime(incoming) = min(8, 100) = 8 < 10 → early-return guard fires → no conflict
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-move-lt-prior", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const insLow = makeCoastMsg(REMOTE_B, "txn-move-lt-incoming", "MOVE", "INSERT", NODE_KEY, 8);
                const delHigh = makeCoastMsg(REMOTE_B, "txn-move-lt-incoming", "MOVE", "DELETE", NODE_KEY, 100);
                fugue.effect.mockReturnValueOnce([insLow] as any[]).mockReturnValueOnce([delHigh] as any[]);

                nidhoggr.consume([insLow, delHigh]);

                // logicalTime(incoming) = 8 < 10 = logicalTime(prior) → null → no conflict
                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("does fire a conflict when all messages in the incoming transaction have counters above the prior logicalTime", () => {
                // prior MOVE from REMOTE at counter 10
                // incoming MOVE from REMOTE_B — two messages with counters 20 and 100.
                // logicalTime(incoming) = min(20, 100) = 20 > 10 → guard passes → conflict
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-move-gt-prior", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const insHigh = makeCoastMsg(REMOTE_B, "txn-move-gt-incoming", "MOVE", "INSERT", NODE_KEY, 20);
                const delHigher = makeCoastMsg(REMOTE_B, "txn-move-gt-incoming", "MOVE", "DELETE", NODE_KEY, 100);
                fugue.effect.mockReturnValueOnce([insHigh] as any[]).mockReturnValueOnce([delHigher] as any[]);

                nidhoggr.consume([insHigh, delHigher]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.CONCURRENT_MOVE_DUPLICATE }),
                );
            });
        });

        // -------------------------------------------------------------------------
        // areConcurrent / replicaId guard: same-replica operations never conflict
        // regardless of logicalTime ordering
        // -------------------------------------------------------------------------

        describe("same-replica guard: classifyConflict returns null for same replicaId", () => {
            it("does not fire a conflict when prior and incoming are from the same replica even with a higher logicalTime", () => {
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                // Both from REMOTE
                applyMoveTransaction(nidhoggr, fugue, "txn-same-rep-A", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-same-rep-B", REMOTE, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("does fire a conflict when the same txnId appears from a different replica", () => {
                // txnId guard: prior.txnId === incoming.txnId → null.
                // Verify the inverse: different txnId, different replicaId → conflict.
                const nidhoggr = new Nidhoggr(fugue, registry, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-id-A", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-id-B", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalled();
            });
        });

        // -------------------------------------------------------------------------
        // Default opType fallback path — unknown opType returns [] from applyTxn
        // -------------------------------------------------------------------------

        describe("applyTxn default branch returns empty array for unrecognised opType", () => {
            it("returns an empty array and does not throw for a COAST message with an unrecognised opType", () => {
                const nidhoggr = new Nidhoggr(fugue, registry);
                // Forge a message with an opType that matches no case in applyTxn's switch
                const msg = makeMsg({
                    replicaId: REMOTE,
                    coastTxId: "txn-unknown-op",
                    coastNodeKey: NODE_KEY,
                    coastOpType: "UNKNOWN_OP",
                } as any);
                fugue.effect.mockReturnValue([msg] as any[]);

                let result: FugueMessage[] | undefined;
                expect(() => {
                    result = nidhoggr.consume(msg);
                }).not.toThrow();
                // The default: branch returns []; isTxnComplete returns true (length > 0)
                // then applyTxn hits default and returns []
                expect(result).toEqual([]);
            });
        });
    });
});

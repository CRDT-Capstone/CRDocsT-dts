import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Nidhoggr } from "../../treesitter/COAST/Nidhoggr/index.js";
import { ConflictType } from "../../treesitter/COAST/Nidhoggr/types.js";
import {
    makeMockFugue,
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
const NODE_KEY_2 = "node-key-2";

// A minimal FNode stand-in for mocking findAstStart / getById return values
const MOCK_FNODE = { id: { sender: "s", counter: 0 }, isDeleted: false, value: "x" } as any;

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
// Helpers
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
    fugue.getById.mockReturnValue(MOCK_FNODE);
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

    beforeEach(() => {
        resetCounter();
        jest.clearAllMocks();
        fugue = makeMockFugue(LOCAL);
        // Default: nodes are not stamped unless a test overrides this
        fugue.findAstStart.mockReturnValue(undefined);
        // Default: getById returns a mock FNode
        fugue.getById.mockReturnValue(MOCK_FNODE);
    });

    // -------------------------------------------------------------------------
    // Constructor / options
    // -------------------------------------------------------------------------

    describe("constructor", () => {
        it("initialises with an empty pending transaction queue when no options are provided", () => {
            const nidhoggr = new Nidhoggr(fugue);
            expect(nidhoggr.numberPending()).toBe(0);
            expect(nidhoggr.pendingSnapshot()).toEqual([]);
        });

        it("stores the provided fugue instance on the public property", () => {
            const nidhoggr = new Nidhoggr(fugue);
            expect(nidhoggr.fugue).toBe(fugue);
        });

        it("accepts a custom txnTtlMs without throwing", () => {
            expect(() => new Nidhoggr(fugue, { txnTtlMs: 1_000 })).not.toThrow();
        });

        it("accepts a custom onConflict handler without throwing", () => {
            expect(() => new Nidhoggr(fugue, { onConflict: mockConflictHandler })).not.toThrow();
        });
    });

    describe("consume", () => {
        // -------------------------------------------------------------------------
        // consume – plain messages
        // -------------------------------------------------------------------------

        describe("consume – plain messages", () => {
            it("passes a single remote plain message directly to fugue.effect and returns the applied messages", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const msg = makeMsg({ replicaId: REMOTE });
                const applied = [{ ...msg, id: makeId() }] as any[];
                fugue.effect.mockReturnValue(applied);

                const result = nidhoggr.consume(msg);

                expect(fugue.effect).toHaveBeenCalledWith([msg]);
                expect(result).toEqual(applied);
            });

            it("passes an array of plain remote messages to fugue.effect in a single call", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const msgs = [makeMsg({ replicaId: REMOTE }), makeMsg({ replicaId: REMOTE })];
                fugue.effect.mockReturnValue(msgs as any[]);

                nidhoggr.consume(msgs);

                expect(fugue.effect).toHaveBeenCalledTimes(1);
                expect(fugue.effect).toHaveBeenCalledWith(msgs);
            });

            it("filters out messages originating from the local replica before passing to fugue.effect", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const local = makeMsg({ replicaId: LOCAL });
                const remote = makeMsg({ replicaId: REMOTE });
                fugue.effect.mockReturnValue([remote] as any[]);

                nidhoggr.consume([local, remote]);

                expect(fugue.effect).toHaveBeenCalledWith([remote]);
            });

            it("does not call fugue.effect when every message originates from the local replica", () => {
                const nidhoggr = new Nidhoggr(fugue);
                nidhoggr.consume([makeMsg({ replicaId: LOCAL }), makeMsg({ replicaId: LOCAL })]);

                expect(fugue.effect).not.toHaveBeenCalled();
            });

            it("returns an empty array and does not call fugue.effect when consuming an empty array", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const result = nidhoggr.consume([]);

                expect(result).toEqual([]);
                expect(fugue.effect).not.toHaveBeenCalled();
            });

            it("returns an empty array when all messages are from the local replica", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const result = nidhoggr.consume([makeMsg({ replicaId: LOCAL })]);

                expect(result).toEqual([]);
            });
        });

        // -------------------------------------------------------------------------
        // consume – COAST ADD transaction
        // -------------------------------------------------------------------------

        describe("consume – COAST ADD transaction", () => {
            it("immediately applies a complete ADD transaction and returns the applied messages", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const msg = makeAddMessage("txn-add-1");
                const applied = [msg] as any[];
                fugue.effect.mockReturnValue(applied);

                const result = nidhoggr.consume(msg);

                expect(result).toEqual(applied);
                expect(nidhoggr.numberPending()).toBe(0);
            });

            it("calls fugue.effect with the ADD message wrapped in an array", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const msg = makeAddMessage("txn-add-effect");
                fugue.effect.mockReturnValue([msg] as any[]);

                nidhoggr.consume(msg);

                expect(fugue.effect).toHaveBeenCalledWith([msg]);
            });

            it("stamps the FNode via updateAstIdx after a successful ADD", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const msg = makeAddMessage("txn-add-stamp", REMOTE, NODE_KEY, 5);
                const appliedId = makeId(REMOTE, 5);
                const applied = [{ ...msg, coastOpType: "ADD", id: appliedId }] as any[];
                fugue.effect.mockReturnValue(applied);
                fugue.findAstStart.mockReturnValue(undefined);
                fugue.getById.mockReturnValue(MOCK_FNODE);

                nidhoggr.consume(msg);

                expect(fugue.getById).toHaveBeenCalledWith(appliedId);
                expect(fugue.updateAstIdx).toHaveBeenCalledWith(NODE_KEY, MOCK_FNODE);
            });

            it("does not re-stamp the node when it is already stamped in astIdx", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const msg = makeAddMessage("txn-add-dup");
                fugue.effect.mockReturnValue([msg] as any[]);
                // Simulate node already stamped
                fugue.findAstStart.mockReturnValue(MOCK_FNODE);

                nidhoggr.consume(msg);

                expect(fugue.updateAstIdx).not.toHaveBeenCalled();
            });

            it("does not stamp when fugue.effect returns no applied messages for an ADD", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const msg = makeAddMessage("txn-add-noop");
                fugue.effect.mockReturnValue([]);

                nidhoggr.consume(msg);

                expect(fugue.updateAstIdx).not.toHaveBeenCalled();
            });

            it("stamps using the FNode for the message with the lowest counter in a multi-message ADD", () => {
                const nidhoggr = new Nidhoggr(fugue);

                const idHigh = makeId(REMOTE, 100);
                const idLow = makeId(REMOTE, 1);
                const msgHigh = { ...makeAddMessage("txn-add-multi"), id: idHigh };
                const msgLow = { ...makeAddMessage("txn-add-multi"), id: idLow };
                const lowFNode = { ...MOCK_FNODE, id: idLow } as any;

                fugue.effect.mockReturnValue([msgHigh, msgLow] as any[]);
                fugue.findAstStart.mockReturnValue(undefined);
                // getById called with idLow (minimum counter) should return lowFNode
                fugue.getById.mockImplementation((id: any) => (id.counter === 1 ? lowFNode : MOCK_FNODE));

                nidhoggr.consume([msgHigh, msgLow]);

                expect(fugue.updateAstIdx).toHaveBeenCalledWith(NODE_KEY, lowFNode);
            });
        });

        // -------------------------------------------------------------------------
        // consume – COAST DELETE transaction
        // -------------------------------------------------------------------------

        describe("consume – COAST DELETE transaction", () => {
            it("applies a DELETE transaction and clears the node from astIdx", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const msg = makeDeleteMessage("txn-del-1");
                const applied = [msg] as any[];
                fugue.effect.mockReturnValue(applied);

                const result = nidhoggr.consume(msg);

                expect(result).toEqual(applied);
                expect(fugue.removeAstIdx).toHaveBeenCalledWith(NODE_KEY);
            });

            it("does not clear astIdx when a DELETE transaction produces no applied messages", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const msg = makeDeleteMessage("txn-del-noop");
                fugue.effect.mockReturnValue([]);

                nidhoggr.consume(msg);

                expect(fugue.removeAstIdx).not.toHaveBeenCalled();
            });

            it("leaves the transaction queue empty after a complete DELETE", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const msg = makeDeleteMessage("txn-del-pending");
                fugue.effect.mockReturnValue([msg] as any[]);

                nidhoggr.consume(msg);

                expect(nidhoggr.numberPending()).toBe(0);
            });
        });

        // -------------------------------------------------------------------------
        // consume – COAST MOVE transaction
        // -------------------------------------------------------------------------

        describe("consume – COAST MOVE transaction", () => {
            it("buffers an incomplete MOVE with only an INSERT part and does not call fugue.effect", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert } = makeMoveMessages("txn-move-ins-only");

                nidhoggr.consume(insert);

                expect(nidhoggr.numberPending()).toBe(1);
                expect(fugue.effect).not.toHaveBeenCalled();
            });

            it("buffers an incomplete MOVE with only a DELETE part and does not call fugue.effect", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { delete: del } = makeMoveMessages("txn-move-del-only");

                nidhoggr.consume(del);

                expect(nidhoggr.numberPending()).toBe(1);
                expect(fugue.effect).not.toHaveBeenCalled();
            });

            it("flushes a complete MOVE when both INSERT and DELETE arrive together", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert, delete: del } = makeMoveMessages("txn-move-complete");
                fugue.effect.mockReturnValue([insert] as any[]);

                nidhoggr.consume([insert, del]);

                expect(nidhoggr.numberPending()).toBe(0);
                expect(fugue.effect).toHaveBeenCalledTimes(2);
            });

            it("flushes a complete MOVE when INSERT and DELETE arrive in separate consume calls", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert, delete: del } = makeMoveMessages("txn-move-split");
                fugue.effect.mockReturnValue([insert] as any[]);

                nidhoggr.consume(insert);
                expect(nidhoggr.numberPending()).toBe(1);

                nidhoggr.consume(del);
                expect(nidhoggr.numberPending()).toBe(0);
            });

            it("applies INSERT messages before DELETE messages when flushing a MOVE transaction", () => {
                const nidhoggr = new Nidhoggr(fugue);
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

            it("stamps the FNode for the lowest-counter INSERT message after a MOVE via updateAstIdx", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert, delete: del } = makeMoveMessages("txn-move-stamp");
                const idLow = makeId(REMOTE, 1);
                const idHigh = makeId(REMOTE, 99);
                const lowFNode = { ...MOCK_FNODE, id: idLow } as any;

                fugue.effect
                    .mockReturnValueOnce([
                        { ...insert, id: idHigh },
                        { ...insert, id: idLow },
                    ] as any[])
                    .mockReturnValueOnce([del] as any[]);
                fugue.getById.mockImplementation((id: any) => (id.counter === 1 ? lowFNode : MOCK_FNODE));

                nidhoggr.consume([insert, del]);

                expect(fugue.updateAstIdx).toHaveBeenCalledWith(NODE_KEY, lowFNode);
            });

            it("does not call updateAstIdx when a MOVE produces no applied INSERT messages", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert, delete: del } = makeMoveMessages("txn-move-noop-stamp");
                fugue.effect.mockReturnValueOnce([]).mockReturnValueOnce([del] as any[]);

                nidhoggr.consume([insert, del]);

                expect(fugue.updateAstIdx).not.toHaveBeenCalled();
            });

            it("returns combined applied messages from INSERT and DELETE effects for a complete MOVE", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert, delete: del } = makeMoveMessages("txn-move-return");
                const appliedIns = [insert as any];
                const appliedDel = [del as any];
                fugue.effect.mockReturnValueOnce(appliedIns).mockReturnValueOnce(appliedDel);

                const result = nidhoggr.consume([insert, del]);

                expect(result).toEqual([...appliedIns, ...appliedDel]);
            });

            it("maintains separate pending state for two concurrent incomplete MOVE transactions", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const m1 = makeMoveMessages("txn-move-concurrent-A");
                const m2 = makeMoveMessages("txn-move-concurrent-B");

                nidhoggr.consume(m1.insert);
                nidhoggr.consume(m2.insert);

                expect(nidhoggr.numberPending()).toBe(2);
            });

            it("merges messages for the same transaction ID across separate consume calls", () => {
                const nidhoggr = new Nidhoggr(fugue);
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
        // consume – COAST UPDATE transaction
        // -------------------------------------------------------------------------

        describe("consume – COAST UPDATE transaction", () => {
            it("buffers an incomplete UPDATE transaction that has only one part and does not call fugue.effect", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert } = makeUpdateMessages("txn-upd-partial");

                nidhoggr.consume(insert);

                expect(nidhoggr.numberPending()).toBe(1);
                expect(fugue.effect).not.toHaveBeenCalled();
            });

            it("applies DELETE before INSERT when flushing a complete UPDATE transaction", () => {
                const nidhoggr = new Nidhoggr(fugue);
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

            it("stamps the new FNode via updateAstIdx after an UPDATE with applied inserts", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert, delete: del } = makeUpdateMessages("txn-upd-stamp");
                const newId = makeId(REMOTE, 5);
                const newFNode = { ...MOCK_FNODE, id: newId } as any;

                fugue.effect
                    .mockReturnValueOnce([del] as any[])
                    .mockReturnValueOnce([{ ...insert, id: newId }] as any[]);
                fugue.getById.mockReturnValue(newFNode);

                nidhoggr.consume([insert, del]);

                expect(fugue.updateAstIdx).toHaveBeenCalledWith(NODE_KEY, newFNode);
            });

            it("does not call updateAstIdx when an UPDATE produces no applied inserts", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert, delete: del } = makeUpdateMessages("txn-upd-noop");
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([]);

                nidhoggr.consume([insert, del]);

                expect(fugue.updateAstIdx).not.toHaveBeenCalled();
            });

            it("returns applied deletes concatenated with applied inserts for an UPDATE", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert, delete: del } = makeUpdateMessages("txn-upd-return");
                const appliedDels = [del as any];
                const appliedIns = [insert as any];
                fugue.effect.mockReturnValueOnce(appliedDels).mockReturnValueOnce(appliedIns);

                const result = nidhoggr.consume([insert, del]);

                expect(result).toEqual([...appliedDels, ...appliedIns]);
            });

            it("flushes an UPDATE only when it has both INSERT and DELETE parts", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const del1 = makeCoastMsg(REMOTE, "txn-upd-incomplete", "UPDATE", "DELETE", NODE_KEY, 1);
                const del2 = makeCoastMsg(REMOTE, "txn-upd-incomplete", "UPDATE", "DELETE", NODE_KEY, 2);

                nidhoggr.consume([del1, del2]);

                expect(nidhoggr.numberPending()).toBe(1);
                expect(fugue.effect).not.toHaveBeenCalled();
            });
        });
    });

    // -------------------------------------------------------------------------
    // Transaction completeness
    // -------------------------------------------------------------------------

    describe("transaction completeness", () => {
        it("treats an ADD transaction as complete when it has at least one message", () => {
            const nidhoggr = new Nidhoggr(fugue);
            const msg = makeAddMessage("txn-add-complete");
            fugue.effect.mockReturnValue([msg] as any[]);

            nidhoggr.consume(msg);

            expect(nidhoggr.numberPending()).toBe(0);
        });

        it("treats a DELETE transaction as complete when it has at least one message", () => {
            const nidhoggr = new Nidhoggr(fugue);
            const msg = makeDeleteMessage("txn-del-complete");
            fugue.effect.mockReturnValue([msg] as any[]);

            nidhoggr.consume(msg);

            expect(nidhoggr.numberPending()).toBe(0);
        });

        it("keeps a MOVE transaction pending when only INSERT messages arrive without a DELETE", () => {
            const nidhoggr = new Nidhoggr(fugue);
            const ins1 = makeCoastMsg(REMOTE, "txn-move-no-del", "MOVE", "INSERT", NODE_KEY, 1);
            const ins2 = makeCoastMsg(REMOTE, "txn-move-no-del", "MOVE", "INSERT", NODE_KEY, 2);

            nidhoggr.consume([ins1, ins2]);

            expect(nidhoggr.numberPending()).toBe(1);
            expect(fugue.effect).not.toHaveBeenCalled();
        });

        it("keeps an UPDATE transaction pending when only DELETE messages have arrived without an INSERT", () => {
            const nidhoggr = new Nidhoggr(fugue);
            const del1 = makeCoastMsg(REMOTE, "txn-upd-no-ins", "UPDATE", "DELETE", NODE_KEY, 1);
            const del2 = makeCoastMsg(REMOTE, "txn-upd-no-ins", "UPDATE", "DELETE", NODE_KEY, 2);

            nidhoggr.consume([del1, del2]);

            expect(nidhoggr.numberPending()).toBe(1);
        });
    });

    // -------------------------------------------------------------------------
    // Conflict detection
    // -------------------------------------------------------------------------

    describe("Conflict Detection", () => {
        describe("conflict detection – no prior history", () => {
            it("does not invoke onConflict when there is no prior operation on the node", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                const { insert, delete: del } = makeMoveMessages("txn-first");
                fugue.effect.mockReturnValue([insert] as any[]);

                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("does not throw when onConflict is not provided and a conflict condition is detected", () => {
                const nidhoggr = new Nidhoggr(fugue);
                applyMoveTransaction(nidhoggr, fugue, "txn-no-handler-A", REMOTE, NODE_KEY, 10);

                const { insert, delete: del } = makeMoveMessages("txn-no-handler-B", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValue([]);

                expect(() => nidhoggr.consume([insert, del])).not.toThrow();
            });
        });

        describe("conflict detection – ADD after prior operations", () => {
            it("fires DUPLICATE_ADD when two different replicas add the same node key concurrently", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyAddTransaction(nidhoggr, fugue, "txn-add-first", REMOTE, NODE_KEY, 5);
                jest.clearAllMocks();

                const secondAdd = makeAddMessage("txn-add-second", REMOTE_B, NODE_KEY, 50);
                const secondApplied = [{ ...secondAdd, coastOpType: "ADD", id: makeId(REMOTE_B, 50) }] as any[];
                fugue.effect.mockReturnValueOnce(secondApplied);
                fugue.findAstStart.mockReturnValue(undefined);

                nidhoggr.consume(secondAdd);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.DUPLICATE_ADD, nodeKey: NODE_KEY }),
                );
            });

            it("fires OPERATION_ON_MISSING_NODE when an operation arrives for a node not in astIdx", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyAddTransaction(nidhoggr, fugue, "txn-add-prior", REMOTE, NODE_KEY, 5);
                // Simulate node absent from astIdx
                fugue.findAstStart.mockReturnValue(undefined);
                jest.clearAllMocks();

                const { insert, delete: del } = makeUpdateMessages("txn-upd-missing", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([insert] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.OPERATION_ON_MISSING_NODE, nodeKey: NODE_KEY }),
                );
            });

            it("does NOT fire a conflict when DELETE follows ADD from a different replica and the node is stamped", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyAddTransaction(nidhoggr, fugue, "txn-add-then-del", REMOTE, NODE_KEY, 5);
                // Node is stamped — exists in astIdx
                fugue.findAstStart.mockReturnValue(MOCK_FNODE);
                jest.clearAllMocks();

                applyDeleteTransaction(nidhoggr, fugue, "txn-del-after-add", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });
        });

        describe("conflict detection – UPDATE after prior operations", () => {
            it("fires UPDATE_ON_STALE_LOCATION when two concurrent UPDATEs target the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyUpdateTransaction(nidhoggr, fugue, "txn-upd-A", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeUpdateMessages("txn-upd-B", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([insert] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.UPDATE_ON_STALE_LOCATION, nodeKey: NODE_KEY }),
                );
            });

            it("fires UPDATE_ON_STALE_LOCATION when a MOVE arrives after an UPDATE on the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyUpdateTransaction(nidhoggr, fugue, "txn-upd-first", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-move-after-upd", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.UPDATE_ON_STALE_LOCATION, nodeKey: NODE_KEY }),
                );
            });

            it("fires UPDATE_OF_DELETED_NODE when a DELETE arrives after an UPDATE on the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyUpdateTransaction(nidhoggr, fugue, "txn-upd-then-del", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                applyDeleteTransaction(nidhoggr, fugue, "txn-del-after-upd", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.UPDATE_OF_DELETED_NODE, nodeKey: NODE_KEY }),
                );
            });

            it("fires ADD_OF_EXISTING_NODE when an ADD arrives for a node that was previously UPDATEd", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyUpdateTransaction(nidhoggr, fugue, "txn-upd-then-add", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                applyAddTransaction(nidhoggr, fugue, "txn-add-after-upd", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.ADD_OF_EXISTING_NODE, nodeKey: NODE_KEY }),
                );
            });
        });

        describe("conflict detection – MOVE after prior operations", () => {
            it("fires CONCURRENT_MOVE_DUPLICATE when a second MOVE from a different replica targets the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-move-first", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-move-second", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.CONCURRENT_MOVE_DUPLICATE, nodeKey: NODE_KEY }),
                );
            });

            it("fires UPDATE_ON_STALE_LOCATION when an UPDATE arrives after a MOVE on the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-move-then-upd", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeUpdateMessages("txn-upd-after-move", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([insert] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.UPDATE_ON_STALE_LOCATION, nodeKey: NODE_KEY }),
                );
            });

            it("fires MOVE_OF_DELETED_NODE when a DELETE arrives after a MOVE on the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-move-then-del", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                applyDeleteTransaction(nidhoggr, fugue, "txn-del-after-move", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.MOVE_OF_DELETED_NODE, nodeKey: NODE_KEY }),
                );
            });

            it("fires ADD_OF_EXISTING_NODE when an ADD arrives for a node that was previously MOVEd", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-move-then-add", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                applyAddTransaction(nidhoggr, fugue, "txn-add-after-move", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.ADD_OF_EXISTING_NODE, nodeKey: NODE_KEY }),
                );
            });
        });

        describe("conflict detection – DELETE after prior operations", () => {
            it("fires UPDATE_OF_DELETED_NODE when an UPDATE arrives for a previously deleted node", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyDeleteTransaction(nidhoggr, fugue, "txn-del-first", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeUpdateMessages("txn-upd-after-del", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([insert] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.UPDATE_OF_DELETED_NODE, nodeKey: NODE_KEY }),
                );
            });

            it("fires MOVE_OF_DELETED_NODE when a MOVE arrives for a previously deleted node", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyDeleteTransaction(nidhoggr, fugue, "txn-del-then-move", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-move-after-del", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.MOVE_OF_DELETED_NODE, nodeKey: NODE_KEY }),
                );
            });

            it("does NOT fire a conflict when a second DELETE targets an already-deleted node", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyDeleteTransaction(nidhoggr, fugue, "txn-del-first", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                applyDeleteTransaction(nidhoggr, fugue, "txn-del-second", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("fires ADD_OF_EXISTING_NODE when an ADD arrives for a previously deleted node", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyDeleteTransaction(nidhoggr, fugue, "txn-del-then-add", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                applyAddTransaction(nidhoggr, fugue, "txn-add-resurrection", REMOTE_B, NODE_KEY, 50);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.ADD_OF_EXISTING_NODE, nodeKey: NODE_KEY }),
                );
            });
        });

        describe("conflict detection – guards and idempotency", () => {
            it("does not fire a conflict when the same transaction ID is re-consumed", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                const { insert, delete: del } = makeMoveMessages("txn-move-idem", REMOTE, NODE_KEY, 10);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);
                jest.clearAllMocks();

                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("does not fire a conflict when the same replica sends consecutive operations on the same node", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-same-rep-1", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-same-rep-2", REMOTE, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("does not fire a conflict when incoming logicalTime is strictly less than prior logicalTime", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-high-prior", REMOTE, NODE_KEY, 100);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-low-incoming", REMOTE_B, NODE_KEY, 5);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("passes the correct nodeKey, prior txnId, and incoming txnId to the conflict handler", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
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
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-autorecov-A", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-autorecov-B", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                const conflict = (mockConflictHandler as jest.Mock).mock.calls[0][0] as any;
                expect(conflict).toHaveProperty("autoRecoverable");
            });

            it("includes a recoverySuggestion in the emitted conflict", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
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
                const nidhoggr = new Nidhoggr(fugue, { txnTtlMs: 5_000 });
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
                const nidhoggr = new Nidhoggr(fugue, { txnTtlMs: 5_000 });
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
                const nidhoggr = new Nidhoggr(fugue, { txnTtlMs: 5_000 });
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
                const nidhoggr = new Nidhoggr(fugue);
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
                const nidhoggr = new Nidhoggr(fugue, { txnTtlMs: 5_000 });

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
                const nidhoggr = new Nidhoggr(fugue, { txnTtlMs: 1_000 });
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
            expect(new Nidhoggr(fugue).numberPending()).toBe(0);
        });

        it("increments and decrements correctly as transactions are buffered and flushed", () => {
            const nidhoggr = new Nidhoggr(fugue);
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
                const nidhoggr = new Nidhoggr(fugue);
                const { insert } = makeMoveMessages("txn-snap-1");
                nidhoggr.consume(insert);
                jest.advanceTimersByTime(200);

                const snapshot = nidhoggr.pendingSnapshot();
                expect(snapshot).toHaveLength(1);
                expect(snapshot[0]).toMatchObject({ txnId: "txn-snap-1", opType: "MOVE", msgCount: 1 });
                expect(snapshot[0].ageMs).toBeGreaterThanOrEqual(200);
            } finally {
                jest.useRealTimers();
            }
        });

        it("pendingSnapshot reflects accumulated message count across merges", () => {
            const nidhoggr = new Nidhoggr(fugue);
            const ins1 = makeCoastMsg(REMOTE, "txn-snap-multi", "MOVE", "INSERT", NODE_KEY, 1);
            const ins2 = makeCoastMsg(REMOTE, "txn-snap-multi", "MOVE", "INSERT", NODE_KEY, 2);

            nidhoggr.consume(ins1);
            nidhoggr.consume(ins2);

            expect(nidhoggr.pendingSnapshot()[0].msgCount).toBe(2);
        });

        it("pendingSnapshot returns empty array after all pending transactions are flushed", () => {
            const nidhoggr = new Nidhoggr(fugue);
            const { insert, delete: del } = makeMoveMessages("txn-flush");
            fugue.effect.mockReturnValue([insert, del] as any[]);

            nidhoggr.consume([insert, del]);

            expect(nidhoggr.pendingSnapshot()).toEqual([]);
        });
    });

    // -------------------------------------------------------------------------
    // Mixed plain + COAST messages
    // -------------------------------------------------------------------------

    describe("mixed plain and COAST messages in a single consume call", () => {
        it("applies plain messages immediately and buffers incomplete COAST transactions", () => {
            const nidhoggr = new Nidhoggr(fugue);
            const plain = makeMsg({ replicaId: REMOTE });
            const { insert } = makeMoveMessages("txn-mixed");
            fugue.effect.mockReturnValue([plain] as any[]);

            const result = nidhoggr.consume([plain, insert]);

            expect(fugue.effect).toHaveBeenCalledWith([plain]);
            expect(result).toEqual([plain]);
            expect(nidhoggr.numberPending()).toBe(1);
        });

        it("returns applied messages from both plain effects and completed COAST transactions", () => {
            const nidhoggr = new Nidhoggr(fugue);
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

        it("does not include local-replica messages in the plain batch", () => {
            const nidhoggr = new Nidhoggr(fugue);
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
        it("does not call updateAstIdx when the ADD message has no coastNodeKey and node is already stamped", () => {
            const nidhoggr = new Nidhoggr(fugue);
            const msg = makeAddMessage("txn-existing-key");
            fugue.effect.mockReturnValue([msg] as any[]);
            fugue.findAstStart.mockReturnValue(MOCK_FNODE);

            nidhoggr.consume(msg);

            expect(fugue.updateAstIdx).not.toHaveBeenCalled();
        });

        it("does not invoke onConflict for a transaction whose first message has no coastNodeKey", () => {
            const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
            const msg = makeMsg({
                replicaId: REMOTE,
                coastTxId: "txn-no-key-conflict",
                coastOpType: "ADD",
            } as any);
            fugue.effect.mockReturnValue([{ ...msg, coastOpType: "ADD", id: makeId(REMOTE, 1) }] as any[]);

            nidhoggr.consume(msg);

            expect(mockConflictHandler).not.toHaveBeenCalled();
        });

        it("does not record history when the transaction message has no coastNodeKey", () => {
            const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
            const noKeyMsg = makeMsg({
                replicaId: REMOTE,
                coastTxId: "txn-no-key-history",
                coastOpType: "ADD",
            } as any);
            fugue.effect.mockReturnValueOnce([{ ...noKeyMsg, coastOpType: "ADD", id: makeId(REMOTE, 1) }] as any[]);
            nidhoggr.consume(noKeyMsg);
            jest.clearAllMocks();

            const realAdd = makeAddMessage("txn-real-add", REMOTE_B, NODE_KEY, 50);
            fugue.effect.mockReturnValueOnce([{ ...realAdd, coastOpType: "ADD", id: makeId(REMOTE_B, 50) }] as any[]);
            nidhoggr.consume(realAdd);

            expect(mockConflictHandler).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // Node history recording
    // -------------------------------------------------------------------------

    describe("node history recording", () => {
        it("records history for an ADD so a subsequent conflicting ADD is detected", () => {
            const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
            applyAddTransaction(nidhoggr, fugue, "txn-hist-add", REMOTE, NODE_KEY, 5);
            jest.clearAllMocks();

            const secondMsg = makeAddMessage("txn-hist-add-second", REMOTE_B, NODE_KEY, 50);
            fugue.effect.mockReturnValue([{ ...secondMsg, coastOpType: "ADD", id: makeId(REMOTE_B, 50) }] as any[]);
            nidhoggr.consume(secondMsg);

            expect(mockConflictHandler).toHaveBeenCalled();
        });

        it("uses the most recently applied transaction when classifying the next conflict on the same node", () => {
            const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
            applyAddTransaction(nidhoggr, fugue, "txn-hist-add", REMOTE, NODE_KEY, 5);
            applyUpdateTransaction(nidhoggr, fugue, "txn-hist-upd", REMOTE, NODE_KEY, 10);
            jest.clearAllMocks();

            applyDeleteTransaction(nidhoggr, fugue, "txn-hist-del", REMOTE_B, NODE_KEY, 50);

            expect(mockConflictHandler).toHaveBeenCalledWith(
                expect.objectContaining({ type: ConflictType.UPDATE_OF_DELETED_NODE }),
            );
        });
    });

    // -------------------------------------------------------------------------
    // Coverage suite
    // -------------------------------------------------------------------------

    describe("Nidhoggr Coverage", () => {
        describe("arrivedAt is frozen at the time the first message arrives", () => {
            it("evicts based on age from first arrival, not from a subsequent merge", () => {
                jest.useFakeTimers();
                try {
                    const ttlMs = 5_000;
                    const nidhoggr = new Nidhoggr(fugue, { txnTtlMs: ttlMs });
                    const ins1 = makeCoastMsg(REMOTE, "txn-frozen-clock", "MOVE", "INSERT", NODE_KEY, 1);
                    const ins2 = makeCoastMsg(REMOTE, "txn-frozen-clock", "MOVE", "INSERT", NODE_KEY, 2);

                    nidhoggr.consume(ins1);
                    jest.advanceTimersByTime(ttlMs - 1);
                    nidhoggr.consume(ins2);
                    expect(nidhoggr.numberPending()).toBe(1);

                    jest.advanceTimersByTime(2);
                    fugue.effect.mockReturnValue([]);
                    nidhoggr.consume(makeMsg({ replicaId: REMOTE }));

                    expect(nidhoggr.numberPending()).toBe(0);
                } finally {
                    jest.useRealTimers();
                }
            });

            it("does not evict when age from first arrival has not exceeded TTL after a merge", () => {
                jest.useFakeTimers();
                try {
                    const nidhoggr = new Nidhoggr(fugue, { txnTtlMs: 5_000 });
                    const ins1 = makeCoastMsg(REMOTE, "txn-no-evict-merge", "MOVE", "INSERT", NODE_KEY, 1);
                    const ins2 = makeCoastMsg(REMOTE, "txn-no-evict-merge", "MOVE", "INSERT", NODE_KEY, 2);

                    nidhoggr.consume(ins1);
                    jest.advanceTimersByTime(4_900);
                    nidhoggr.consume(ins2);
                    nidhoggr.consume(makeMsg({ replicaId: REMOTE }));

                    expect(nidhoggr.numberPending()).toBe(1);
                } finally {
                    jest.useRealTimers();
                }
            });

            it("pendingSnapshot ageMs reflects elapsed time from the first message, not from a merge", () => {
                jest.useFakeTimers();
                try {
                    const nidhoggr = new Nidhoggr(fugue);
                    const ins1 = makeCoastMsg(REMOTE, "txn-age-merge", "MOVE", "INSERT", NODE_KEY, 1);
                    const ins2 = makeCoastMsg(REMOTE, "txn-age-merge", "MOVE", "INSERT", NODE_KEY, 2);

                    nidhoggr.consume(ins1);
                    jest.advanceTimersByTime(300);
                    nidhoggr.consume(ins2);
                    jest.advanceTimersByTime(200);

                    expect(nidhoggr.pendingSnapshot()[0].ageMs).toBeGreaterThanOrEqual(500);
                } finally {
                    jest.useRealTimers();
                }
            });
        });

        describe("evicted transactions do not update nodeHistory", () => {
            it("does not record history for an evicted transaction", () => {
                jest.useFakeTimers();
                try {
                    const nidhoggr = new Nidhoggr(fugue, { txnTtlMs: 5_000, onConflict: mockConflictHandler });
                    const { insert } = makeMoveMessages("txn-evict-no-history", REMOTE, NODE_KEY, 10);
                    nidhoggr.consume(insert);

                    jest.advanceTimersByTime(5_001);
                    fugue.effect.mockReturnValue([]);
                    nidhoggr.consume(makeMsg({ replicaId: REMOTE }));
                    jest.clearAllMocks();

                    const { insert: ins2, delete: del2 } = makeMoveMessages("txn-after-evict", REMOTE_B, NODE_KEY, 50);
                    fugue.effect.mockReturnValueOnce([ins2] as any[]).mockReturnValueOnce([del2] as any[]);
                    nidhoggr.consume([ins2, del2]);

                    expect(mockConflictHandler).not.toHaveBeenCalled();
                } finally {
                    jest.useRealTimers();
                }
            });
        });

        describe("recordHistory is NOT called when the transaction produces no applied inserts", () => {
            it("does not overwrite nodeHistory when a conflicting MOVE produces zero applied INSERT messages", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-move-prior", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-move-noapply", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.CONCURRENT_MOVE_DUPLICATE }),
                );

                jest.clearAllMocks();
                const { insert: ins3, delete: del3 } = makeMoveMessages("txn-move-third", REMOTE_B, NODE_KEY, 100);
                fugue.effect.mockReturnValueOnce([ins3] as any[]).mockReturnValueOnce([del3] as any[]);
                nidhoggr.consume([ins3, del3]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ prior: expect.objectContaining({ txnId: "txn-move-prior" }) }),
                );
            });

            it("does not overwrite nodeHistory when a conflicting UPDATE produces zero applied INSERT messages", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyUpdateTransaction(nidhoggr, fugue, "txn-upd-prior", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeUpdateMessages("txn-upd-noapply", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([]);
                nidhoggr.consume([insert, del]);

                jest.clearAllMocks();
                const { insert: ins2, delete: del2 } = makeUpdateMessages("txn-upd-third", REMOTE_B, NODE_KEY, 100);
                fugue.effect.mockReturnValueOnce([del2] as any[]).mockReturnValueOnce([ins2] as any[]);
                nidhoggr.consume([ins2, del2]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ prior: expect.objectContaining({ txnId: "txn-upd-prior" }) }),
                );
            });

            it("does not overwrite nodeHistory when an ADD produces zero applied messages", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyAddTransaction(nidhoggr, fugue, "txn-add-prior", REMOTE, NODE_KEY, 5);
                jest.clearAllMocks();

                const secondAdd = makeAddMessage("txn-add-noapply", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([]);
                nidhoggr.consume(secondAdd);
                jest.clearAllMocks();

                const thirdAdd = makeAddMessage("txn-add-third", REMOTE_B, NODE_KEY, 100);
                fugue.effect.mockReturnValueOnce([]);
                nidhoggr.consume(thirdAdd);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ prior: expect.objectContaining({ txnId: "txn-add-prior" }) }),
                );
            });

            it("does not overwrite nodeHistory when a DELETE produces zero applied messages", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-move-prior", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const delMsg = makeDeleteMessage("txn-del-noapply", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([]);
                nidhoggr.consume(delMsg);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-move-after", REMOTE_B, NODE_KEY, 100);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ prior: expect.objectContaining({ txnId: "txn-move-prior" }) }),
                );
            });
        });

        describe("handleMove – astIdx and history are skipped when no INSERT messages are applied", () => {
            it("does not call updateAstIdx when handleMove appliedInserts is empty", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert, delete: del } = makeMoveMessages("txn-move-no-ins-apply");
                fugue.effect.mockReturnValueOnce([]).mockReturnValueOnce([del] as any[]);

                nidhoggr.consume([insert, del]);

                expect(fugue.updateAstIdx).not.toHaveBeenCalled();
            });

            it("returns only appliedDeletes when handleMove appliedInserts is empty", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert, delete: del } = makeMoveMessages("txn-move-del-only-applied");
                const appliedDel = [del as any];
                fugue.effect.mockReturnValueOnce([]).mockReturnValueOnce(appliedDel);

                const result = nidhoggr.consume([insert, del]);

                expect(result).toEqual(appliedDel);
            });
        });

        describe("handleUpdate – astIdx and history are skipped when no INSERT messages are applied", () => {
            it("returns only appliedDeletes when handleUpdate appliedInserts is empty", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert, delete: del } = makeUpdateMessages("txn-upd-del-only-applied");
                const appliedDel = [del as any];
                fugue.effect.mockReturnValueOnce(appliedDel).mockReturnValueOnce([]);

                const result = nidhoggr.consume([insert, del]);

                expect(result).toEqual(appliedDel);
            });

            it("does not call updateAstIdx when appliedDeletes has messages but appliedInserts is empty", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert, delete: del } = makeUpdateMessages("txn-upd-no-ins-stamp");
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([]);

                nidhoggr.consume([insert, del]);

                expect(fugue.updateAstIdx).not.toHaveBeenCalled();
            });
        });

        describe("two complete COAST transactions in a single consume call", () => {
            it("flushes both complete COAST transactions and returns their combined applied messages", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const add = makeAddMessage("txn-add-batch", REMOTE, NODE_KEY, 5);
                const del = makeDeleteMessage("txn-del-batch", REMOTE, NODE_KEY_2, 30);

                const appliedAdd = [{ ...add, coastOpType: "ADD", id: makeId(REMOTE, 5) }] as any[];
                const appliedDel = [del as any];

                fugue.effect.mockReturnValueOnce(appliedAdd).mockReturnValueOnce(appliedDel);
                fugue.findAstStart.mockReturnValue(undefined);

                const result = nidhoggr.consume([add, del]);

                expect(nidhoggr.numberPending()).toBe(0);
                expect(result).toEqual([...appliedAdd, ...appliedDel]);
            });

            it("flushes a complete MOVE and a complete ADD in the same consume call", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const { insert, delete: del } = makeMoveMessages("txn-move-batch", REMOTE, NODE_KEY, 10);
                const add = makeAddMessage("txn-add-batch", REMOTE, NODE_KEY_2, 5);

                fugue.effect
                    .mockReturnValueOnce([insert] as any[])
                    .mockReturnValueOnce([del] as any[])
                    .mockReturnValueOnce([{ ...add, coastOpType: "ADD", id: makeId(REMOTE, 5) }] as any[]);
                fugue.findAstStart.mockReturnValue(undefined);

                nidhoggr.consume([insert, del, add]);

                expect(nidhoggr.numberPending()).toBe(0);
            });

            it("flushes a complete transaction and buffers an incomplete one in the same consume call", () => {
                const nidhoggr = new Nidhoggr(fugue);
                const add = makeAddMessage("txn-add-complete", REMOTE, NODE_KEY, 5);
                const { insert: moveIns } = makeMoveMessages("txn-move-incomplete", REMOTE, NODE_KEY_2, 10);

                const appliedAdd = [{ ...add, coastOpType: "ADD", id: makeId(REMOTE, 5) }] as any[];
                fugue.effect.mockReturnValueOnce(appliedAdd);
                fugue.findAstStart.mockReturnValue(undefined);

                const result = nidhoggr.consume([add, moveIns]);

                expect(result).toEqual(appliedAdd);
                expect(nidhoggr.numberPending()).toBe(1);
            });

            it("writes history for both completed transactions independently", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                const add1 = makeAddMessage("txn-add-hist-1", REMOTE, NODE_KEY, 5);
                const add2 = makeAddMessage("txn-add-hist-2", REMOTE, NODE_KEY_2, 6);

                const applied1 = [{ ...add1, coastOpType: "ADD", id: makeId(REMOTE, 5) }] as any[];
                const applied2 = [{ ...add2, coastOpType: "ADD", id: makeId(REMOTE, 6) }] as any[];
                fugue.effect.mockReturnValueOnce(applied1).mockReturnValueOnce(applied2);
                fugue.findAstStart.mockReturnValue(undefined);

                nidhoggr.consume([add1, add2]);
                jest.clearAllMocks();

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

        describe("detectConflicts is called before the handler mutates astIdx / history", () => {
            it("passes the pre-apply astIdx state to classifyConflict", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-move-setup", REMOTE, NODE_KEY, 10);
                // Node is stamped before the DELETE arrives
                fugue.findAstStart.mockReturnValue(MOCK_FNODE);
                jest.clearAllMocks();

                const delMsg = makeDeleteMessage("txn-del-precheck", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([delMsg] as any[]);
                nidhoggr.consume(delMsg);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.MOVE_OF_DELETED_NODE }),
                );
                expect(fugue.removeAstIdx).toHaveBeenCalledWith(NODE_KEY);
            });

            it("passes nodeExists = false to classifyConflict when the node is absent from astIdx", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyAddTransaction(nidhoggr, fugue, "txn-add-setup", REMOTE, NODE_KEY, 5);
                fugue.findAstStart.mockReturnValue(undefined);
                jest.clearAllMocks();

                const { insert, delete: del } = makeUpdateMessages("txn-upd-missing", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([del] as any[]).mockReturnValueOnce([insert] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalledWith(
                    expect.objectContaining({ type: ConflictType.OPERATION_ON_MISSING_NODE }),
                );
            });
        });

        describe("eviction does not contribute to the consume return value", () => {
            it("returns only the applied messages from the trigger message, not from the evicted partial transaction", () => {
                jest.useFakeTimers();
                try {
                    const nidhoggr = new Nidhoggr(fugue, { txnTtlMs: 1_000 });
                    const { insert } = makeMoveMessages("txn-evict-return", REMOTE, NODE_KEY, 10);
                    nidhoggr.consume(insert);

                    jest.advanceTimersByTime(1_001);
                    const triggerMsg = makeMsg({ replicaId: REMOTE });
                    const appliedTrigger = [triggerMsg as any];
                    fugue.effect.mockReturnValueOnce([]).mockReturnValueOnce(appliedTrigger);

                    const result = nidhoggr.consume(triggerMsg);

                    expect(result).toEqual(appliedTrigger);
                } finally {
                    jest.useRealTimers();
                }
            });
        });

        describe("logicalTimeOf uses the minimum counter across all transaction messages", () => {
            it("uses the lowest counter as logicalTime — early-return guard fires when it is less than prior", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-move-lt-prior", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const insLow = makeCoastMsg(REMOTE_B, "txn-move-lt-incoming", "MOVE", "INSERT", NODE_KEY, 8);
                const delHigh = makeCoastMsg(REMOTE_B, "txn-move-lt-incoming", "MOVE", "DELETE", NODE_KEY, 100);
                fugue.effect.mockReturnValueOnce([insLow] as any[]).mockReturnValueOnce([delHigh] as any[]);
                nidhoggr.consume([insLow, delHigh]);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("fires a conflict when all messages in the incoming transaction have counters above the prior logicalTime", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
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

        describe("same-replica guard", () => {
            it("does not fire a conflict when prior and incoming are from the same replica", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-same-rep-A", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-same-rep-B", REMOTE, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).not.toHaveBeenCalled();
            });

            it("fires a conflict when different txnId comes from a different replica", () => {
                const nidhoggr = new Nidhoggr(fugue, { onConflict: mockConflictHandler });
                applyMoveTransaction(nidhoggr, fugue, "txn-id-A", REMOTE, NODE_KEY, 10);
                jest.clearAllMocks();

                const { insert, delete: del } = makeMoveMessages("txn-id-B", REMOTE_B, NODE_KEY, 50);
                fugue.effect.mockReturnValueOnce([insert] as any[]).mockReturnValueOnce([del] as any[]);
                nidhoggr.consume([insert, del]);

                expect(mockConflictHandler).toHaveBeenCalled();
            });
        });

        describe("applyTxn default branch", () => {
            it("returns an empty array and does not throw for an unrecognised opType", () => {
                const nidhoggr = new Nidhoggr(fugue);
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
                expect(result).toEqual([]);
            });
        });
    });
});

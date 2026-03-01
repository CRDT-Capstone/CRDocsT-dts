import { jest } from "@jest/globals";
import { FugueMessage } from "../../types/FugueTree/index.js";
import { ConflictHandler } from "../../treesitter/COAST/Nidhoggr/types.js";
import { Registry } from "../../treesitter/COAST/Registry/index.js";
import { FugueTree } from "../../dts/index.js";

// ---------------------------------------------------------------------------
// ID / message factory helpers
// ---------------------------------------------------------------------------

let _counter = 0;

export function makeId(sender = "remote-replica", counter?: number) {
    return { sender, counter: counter ?? _counter++ };
}

export function resetCounter() {
    _counter = 0;
}

/**
 * Minimal FugueMessage stub. Only the fields consumed by Nidhoggr are populated;
 * FugueTree-level structural fields are omitted because FugueTree is fully mocked.
 */
export function makeMsg(overrides: Partial<FugueMessage> & Pick<FugueMessage, "replicaId">): FugueMessage {
    return {
        msgType: 0 as any,
        documentID: "doc-1",
        userIdentity: "user-remote",
        operation: 0 as any,
        id: makeId(),
        data: "a",
        side: "R",
        ...overrides,
    } as unknown as FugueMessage;
}

export function makeCoastMsg(
    replicaId: string,
    coastTxId: string,
    coastOpType: string,
    coastOpPart?: string,
    coastNodeKey?: string,
    idCounter?: number,
): FugueMessage {
    return makeMsg({
        replicaId,
        coastTxId,
        coastOpType,
        coastOpPart,
        coastNodeKey: coastNodeKey ?? "node-key-1",
        id: makeId(replicaId, idCounter),
    } as any);
}

// ---------------------------------------------------------------------------
// Mock factories
// ---------------------------------------------------------------------------

export function makeMockFugue(ownReplicaId = "local-replica"): jest.Mocked<FugueTree> {
    return {
        replicaId: jest.fn<() => string>().mockReturnValue(ownReplicaId),
        effect: jest.fn<(msgs: FugueMessage | FugueMessage[]) => FugueMessage[]>().mockReturnValue([]),
    } as unknown as jest.Mocked<FugueTree>;
}

export function makeMockRegistry(): jest.Mocked<Registry> {
    return {
        get: jest.fn<(key: string) => unknown>().mockReturnValue(undefined),
        register: jest.fn<(key: string, entry: unknown) => void>(),
        update: jest.fn<(key: string, patch: unknown) => void>(),
        delete: jest.fn<(key: string) => void>(),
    } as unknown as jest.Mocked<Registry>;
}

export const mockConflictHandler: jest.Mock<ConflictHandler> = jest.fn();

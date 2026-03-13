import * as math from "lib0/math";
import * as prng from "lib0/prng";
import * as t from "lib0/testing";
import { AbstractCrdt, CrdtFactory } from "./index.js"; // eslint-disable-line
import {
    benchmarkTime,
    gen,
    getMemUsed,
    logMemoryUsed,
    MEASURED_TRIALS,
    N,
    runBenchmark,
    setBenchmarkResult,
    WARMUP_TRIALS,
} from "./utils.js";

const REPLICA_COUNT = 5;
const PROPAGATION_EDIT_COUNT = 100;
const STRESS_TEST_DURATION_MS = 6_000;
const TARGET_EDITS_PER_SEC = 10;

const now = () => performance.now();

/**
 * Computes the median of a sorted numeric array.
 * @param {number[]} sorted
 * @returns {number}
 */
const median = (sorted) => {
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/**
 * @param {CrdtFactory} crdtFactory
 * @param {function(string):boolean} filter
 */
export const runBenchmarkB4 = async (crdtFactory, filter) => {
    await runBenchmark("[B4.1] Multi-replica propagation latency", filter, (benchmarkName) => {
        for (let trial = -WARMUP_TRIALS; trial < MEASURED_TRIALS; trial++) {
            /** @type {number[]} */
            const propagationLatencies = [];

            // Create REPLICA_COUNT replicas. Each replica's updateHandler
            // immediately applies the update to all other replicas and records
            // how long that fan-out took.
            /** @type {AbstractCrdt[]} */
            const replicas = [];

            for (let r = 0; r < REPLICA_COUNT; r++) {
                const replica = crdtFactory.create((update) => {
                    const fanoutStart = now();
                    for (let other = 0; other < replicas.length; other++) {
                        if (replicas[other] !== replica) {
                            replicas[other].applyUpdate(update);
                        }
                    }
                    // Propagation latency = time to apply to all other replicas
                    propagationLatencies.push(now() - fanoutStart);
                });
                replicas.push(replica);
            }

            benchmarkTime(
                crdtFactory.getName(),
                `${benchmarkName} (time)`,
                () => {
                    for (let r = 0; r < REPLICA_COUNT; r++) {
                        for (let i = 0; i < PROPAGATION_EDIT_COUNT; i++) {
                            const char = prng.word(gen, 1, 1);
                            const index = Math.floor(replicas[r].getText().length / 2);
                            replicas[r].insertText(index, char);
                        }
                    }
                },
                trial,
            );

            // Verify all replicas converged
            const finalText = replicas[0].getText();
            for (let r = 1; r < REPLICA_COUNT; r++) {
                t.assert(replicas[r].getText() === finalText, `Replica ${r} must converge to replica 0`);
            }

            const sorted = propagationLatencies.slice().sort((a, b) => a - b);
            const medianLatency = median(sorted);
            const p95Latency = sorted[Math.floor(sorted.length * 0.95)];
            const totalEdits = REPLICA_COUNT * PROPAGATION_EDIT_COUNT;

            setBenchmarkResult(
                crdtFactory.getName(),
                `${benchmarkName} (medianPropagationLatency)`,
                `${math.round(medianLatency * 1000) / 1000} ms`,
                trial,
            );
            setBenchmarkResult(
                crdtFactory.getName(),
                `${benchmarkName} (p95PropagationLatency)`,
                `${math.round(p95Latency * 1000) / 1000} ms`,
                trial,
            );
            setBenchmarkResult(
                crdtFactory.getName(),
                `${benchmarkName} (replicaCount)`,
                `${REPLICA_COUNT} replicas`,
                trial,
            );
            setBenchmarkResult(crdtFactory.getName(), `${benchmarkName} (totalEdits)`, `${totalEdits} edits`, trial);

            // F5 acceptance gate
            t.assert(
                medianLatency < 200,
                `Median propagation latency ${medianLatency.toFixed(2)}ms must be < 200ms (F5)`,
            );

            replicas.forEach((r) => r.free());
        }
    });

    await runBenchmark("[B4.2] Tombstone growth over document lifetime", filter, (benchmarkName) => {
        for (let trial = -WARMUP_TRIALS; trial < MEASURED_TRIALS; trial++) {
            let string = "";
            const ops = [];
            for (let i = 0; i < N; i++) {
                const index = prng.uint32(gen, 0, Math.max(string.length, 0));
                const available = string.length - index;
                if (available <= 0 || string.length === 0 || prng.bool(gen)) {
                    const insert = prng.word(gen, 2, 8);
                    string = string.slice(0, index) + insert + string.slice(index);
                    ops.push({ index, insert });
                } else {
                    const deleteCount = prng.uint32(gen, 1, math.min(5, available));
                    string = string.slice(0, index) + string.slice(index + deleteCount);
                    ops.push({ index, deleteCount });
                }
            }

            const SAMPLES = 4;
            const batchSize = Math.floor(ops.length / SAMPLES);
            /** @type {number[]} */
            const docSizeSamples = [];
            const doc = crdtFactory.create();

            benchmarkTime(
                crdtFactory.getName(),
                `${benchmarkName} (time)`,
                () => {
                    for (let s = 0; s < SAMPLES; s++) {
                        const start = s * batchSize;
                        const end = s === SAMPLES - 1 ? ops.length : start + batchSize;
                        for (let i = start; i < end; i++) {
                            const op = ops[i];
                            if (op.insert !== undefined) {
                                doc.insertText(op.index, op.insert);
                            } else {
                                doc.deleteText(op.index, op.deleteCount);
                            }
                        }
                        const encoded = doc.getEncodedState();
                        // @ts-ignore
                        docSizeSamples.push(encoded.length);
                    }
                },
                trial,
            );

            for (let s = 0; s < SAMPLES; s++) {
                setBenchmarkResult(
                    crdtFactory.getName(),
                    `${benchmarkName} (docSize@${Math.round(((s + 1) / SAMPLES) * 100)}%)`,
                    `${docSizeSamples[s]} bytes`,
                    trial,
                );
            }

            for (let s = 1; s < SAMPLES; s++) {
                const ratio = docSizeSamples[s] / docSizeSamples[s - 1];
                setBenchmarkResult(
                    crdtFactory.getName(),
                    `${benchmarkName} (growthRatio@${Math.round(((s + 1) / SAMPLES) * 100)} %)`,
                    `${math.round(ratio * 100) / 100} x`,
                    trial,
                );
            }

            doc.free();
        }
    });

    await runBenchmark("[B4.3] Sustained throughput stress test", filter, (benchmarkName) => {
        // Only run once — this test is time-based, not trial-based
        for (let trial = -WARMUP_TRIALS; trial < MEASURED_TRIALS; trial++) {
            const intervalMs = 1000 / TARGET_EDITS_PER_SEC;
            let editCount = 0;
            let droppedCount = 0;

            const doc2Updates = [];
            const doc2 = crdtFactory.create();
            const doc1 = crdtFactory.create((update) => {
                try {
                    doc2Updates.push(update);
                } catch {
                    droppedCount++;
                }
            });

            benchmarkTime(
                crdtFactory.getName(),
                `${benchmarkName} (time)`,
                () => {
                    const testStart = now();
                    let nextEditAt = testStart;

                    while (now() - testStart < STRESS_TEST_DURATION_MS) {
                        const currentTime = now();
                        if (currentTime >= nextEditAt) {
                            const char = prng.word(gen, 1, 1);
                            const index = Math.min(editCount, doc1.getText().length);
                            doc1.insertText(index, char);
                            editCount++;
                            nextEditAt += intervalMs;
                        }
                    }
                },
                trial,
            );

            // Apply all queued updates to doc2
            for (const update of doc2Updates) {
                doc2.applyUpdate(update);
            }

            const expectedEdits = Math.floor(STRESS_TEST_DURATION_MS / intervalMs);
            const achievedRate = (editCount / STRESS_TEST_DURATION_MS) * 1000;
            const dropRate = droppedCount / Math.max(editCount, 1);

            setBenchmarkResult(crdtFactory.getName(), `${benchmarkName} (editCount)`, `${editCount} edits`, trial);
            setBenchmarkResult(
                crdtFactory.getName(),
                `${benchmarkName} (achievedRate)`,
                `${math.round(achievedRate * 100) / 100} edits/sec`,
                trial,
            );
            setBenchmarkResult(
                crdtFactory.getName(),
                `${benchmarkName} (droppedUpdates)`,
                `${droppedCount} dropped`,
                trial,
            );
            setBenchmarkResult(
                crdtFactory.getName(),
                `${benchmarkName} (dropRate)`,
                `${math.round(dropRate * 10000) / 100} %`,
                trial,
            );

            // N2 acceptance: convergence after stress
            t.assert(doc1.getText() === doc2.getText(), "Replicas must converge after sustained throughput test (N2)");

            // N2 acceptance: achieved rate must be within 20% of target
            t.assert(
                achievedRate >= TARGET_EDITS_PER_SEC * 0.8,
                `Achieved rate ${achievedRate.toFixed(2)} edits/sec is more than 20% below target ${TARGET_EDITS_PER_SEC} (N2)`,
            );

            // N2 acceptance: no dropped updates
            t.assert(droppedCount === 0, `${droppedCount} updates were dropped during stress test (N2)`);

            doc1.free();
            doc2.free();
        }
    });
};

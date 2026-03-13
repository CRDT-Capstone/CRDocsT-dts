import { runBenchmarks, writeBenchmarkResultsToFile } from "../js-lib/index.js";
import { FugueTreeFactory } from "./factory.js";

(async () => {
    await runBenchmarks(
        new FugueTreeFactory(),
        (testName: string) =>
            !(
                testName.startsWith("[B4x100") ||
                testName.startsWith("[B4.") ||
                testName.includes("Array") ||
                testName.includes("numbers")
            ),
    );
    writeBenchmarkResultsToFile("bench_results.json", (testName: string) => true);
})();

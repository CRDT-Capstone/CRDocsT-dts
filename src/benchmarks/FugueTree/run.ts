import { runBenchmarks, writeBenchmarkResultsToFile } from "../js-lib/index.js";
import { FugueTreeFactory } from "./factory.js";

(async () => {
    await runBenchmarks(
        new FugueTreeFactory(),
        (testName: string) => !(testName.includes("Array") || testName.includes("numbers")),
    );
    writeBenchmarkResultsToFile("bench_results.json", (testName: string) => true);
})();

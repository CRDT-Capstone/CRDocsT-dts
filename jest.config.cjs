const { createDefaultPreset } = require("ts-jest");

/** @type {import("jest").Config} **/
module.exports = {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    transform: {
        // Ensure ts-jest is explicitly told to use ESM for transformations
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: true,
            },
        ],
    },
    moduleNameMapper: {
        // This regex looks for any local import ending in .js and removes the extension
        "^(\\.\\.?\\/.+)\\.js$": "$1",
    },
    extensionsToTreatAsEsm: [".ts"],
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    workerIdleMemoryLimit: "200MB",

    maxWorkers: "50%",
};

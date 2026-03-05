const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testTimeout: 120000,
  transform: {
    ...tsJestTransformCfg,
  },
};
#!/usr/bin/env node
"use strict";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { $, chalk, fs } from "zx";
import { glob } from "glob";
import { error, heading, info } from "./utils/index.mjs";

async function run({ tsConfig, aeConfig }) {
  heading({
    title: "API Extractor",
    script: "shared/scripts/build-api.mjs",
    purpose: "Build TS and Extract bundle",
  });

  // Get file paths
  const tscPaths = await glob(tsConfig);
  const aecPaths = await glob(aeConfig);

  info(
    `Building TS file${tscPaths.length > 1 ? "s" : ""}:\n\n\t${tscPaths.join(",\v\r\t  ")}\n`,
  );

  // Exec TypeScript build for each tsconfig file
  await Promise.all(tscPaths.map((tscPath) => $`npx tsc -b ${tscPath}`)).catch(
    (err) => {
      error("Failed to build TS", err);
      process.exit(1);
    },
  );

  info(
    `Running API Extractor${aecPaths.length > 1 ? "s" : ""}:\n\n\t${aecPaths.join(",\v\r\t  ")}\n`,
  );

  // Exec API Extractor command for each config file
  await Promise.all(
    aecPaths.map(async (aecPath) => {
      await $`npx api-extractor run --local --verbose -c ${aecPath}`;
      const configFile = await fs.readJson(aecPath);
      const filePath = configFile.dtsRollup?.untrimmedFilePath;
      if (filePath) {
        const path = filePath.replace(
          "<projectFolder>",
          configFile.projectFolder ?? ".",
        );
        info(`Replacing "React_2" for "React" from ${chalk.greenBright(path)}`);
        const dtsFile = await fs.readFile(path, "utf-8");
        await fs.writeFile(path, dtsFile.replace(/React_2/g, "React"));
        const mdtsPath = path.replace(/\.d\.ts$/, ".d.mts");
        info(
          `Creating file ${chalk.greenBright(mdtsPath)} out of ${chalk.greenBright(path)}`,
        );
        await fs.copyFile(path, mdtsPath);
      }
    }),
  ).catch((err) => {
    error("Failed to run API extractor", err);
    process.exit(1);
  });

  process.exit(0);
}

const { argv } = yargs(hideBin(process.argv))
  .option("tsConfig", {
    alias: "tsc",
    description: "TypeScript build configuration file.",
    type: "string",
    default: "./tsconfig.json",
  })
  .option("aeConfig", {
    alias: "aec",
    description: "API Extractor configuration file.",
    type: "string",
    default: "./api-extractor.json",
  });

run(argv);

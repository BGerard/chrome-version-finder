import * as cheerio from "cheerio";
import { chain } from "lodash";
import * as compareVersions from "compare-versions";
import { BasePosition, fetchBasePosition, fetchChromiumTags } from "./api";

const isChromiumVersion = (version: string): boolean => /\d+\.\d+\.\d+\.\d+/.test(version);

export interface VersionTags {
  [key: string]: string;
}

export const getAllVersionTags = async (fetchTags: typeof fetchChromiumTags): Promise<VersionTags> => {
  const html = await fetchTags();
  const $ = cheerio.load(html);
  const set = $(".RefList").get(1);
  const setName = $(set).find("h3").text();
  if (setName === "Tags") {
    const versionNumberElements: string[] = $(set)
      .find("ul > li > a")
      .map(function () {
        // @ts-ignore
        return $(this).text();
      })
      .get();
    return chain(versionNumberElements)
      .filter(isChromiumVersion)
      .sort(compareVersions)
      .groupBy((versionString: string) => versionString.split(".")[0])
      .map((versionParts: string[], versionString: string) => [versionString, versionParts[0]])
      .fromPairs()
      .value();
  } else {
    throw new Error("Cannot find Chromium versions.");
  }
};

export const getBasePosition = async (versionTag: string): Promise<number> => {
  const { chromium_base_position }: BasePosition = await fetchBasePosition(versionTag);
  return parseInt(chromium_base_position, 10);
};

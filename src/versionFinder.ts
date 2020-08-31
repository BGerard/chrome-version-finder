import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { chain } from "lodash";
import * as compareVersions from "compare-versions";

const isChromiumVersion = (version: string): boolean =>
  /\d+\.\d+\.\d+\.\d+/.test(version);

export interface VersionTags {
  [key: string]: string;
}

export const getAllVersionTags = async (): Promise<VersionTags> => {
  const res = await fetch(
    "https://chromium.googlesource.com/chromium/src.git/+refs"
  );
  const html = await res.text();
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
      .map((versionParts: string[], versionString: string) => [
        versionString,
        versionParts[0],
      ])
      .fromPairs()
      .value();
  } else {
    throw new Error("Cannot find Chromium versions.");
  }
};

export const getBasePosition = async (versionTag: string): Promise<number> => {
  const res = await fetch(
    `https://omahaproxy.appspot.com/deps.json?version=${versionTag}`
  );
  const { chromium_base_position } = await res.json();
  return chromium_base_position;
};

import { isString } from "lodash";
import { VersionTags } from "./versionFinder";
import { getAllVersionTags, getBasePosition } from "./versionFinder";
import { findPackage } from "./packageFinder";
import { fetchChromiumTags, lookupPackage } from "./api";

const isValidVersion = (version: string) => /\d{2}/.test(version);
const enableVerbosePrint = (flag: string) => isString(flag) && flag === "--verbose";

const main = async () => {
  const versionToFind: string = process.argv[2];
  const verbosePrint: boolean = enableVerbosePrint(process.argv[3]);
  if (isValidVersion(versionToFind)) {
    const versionsByMajor: VersionTags = await getAllVersionTags(fetchChromiumTags);
    const versionTag = versionsByMajor[versionToFind];
    const basePosition: number = await getBasePosition(versionTag);
    const mediaLink: string = (await findPackage(lookupPackage)(basePosition)) as string;
    if (!verbosePrint) {
      return mediaLink;
    }
    return {
      version: versionTag,
      basePosition: basePosition,
      url: mediaLink,
    };
  } else {
    console.error("Invalid major version number");
    process.exit(0);
  }
};

main().then(console.log, console.error);

import {VersionTags} from "./versionFinder";
import { getAllVersionTags, getBasePosition } from "./versionFinder";
import {findPackage} from "./packageFinder";

const isValidVersion = (version: string) => (/\d{2}/.test(version));

const main = async () => {
    const versionToFind: string = process.argv[2];
    if (isValidVersion(versionToFind)) {
        const versionsByMajor: VersionTags = await getAllVersionTags();
        const versionTag = versionsByMajor[versionToFind];
        const basePosition: number = await getBasePosition(versionTag);
        const mediaLink: string = await findPackage(basePosition);
        return {
            version: versionTag,
            basePosition: basePosition,
            url: mediaLink
        };
    } else {
        console.error('Invalid major version number');
        process.exit(0);
    }
};

main().then(console.log, console.error);
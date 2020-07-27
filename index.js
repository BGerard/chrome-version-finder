const fetch = require('node-fetch');
const { getAllVersionTags, getBasePosition } = require("./versionFinder");

const isValidVersion = (version) => (/\d{2}/.test(version));

const findPackage = async (versionToFind, basePosition) => {
    const fields = 'items(kind,mediaLink,metadata,name,size,updated),kind,prefixes,nextPageToken';
    const res = await fetch(`https://www.googleapis.com/storage/v1/b/chromium-browser-snapshots/o?delimiter=/&prefix=Linux_x64/${basePosition}/&fields=${fields}`);
    const json = await res.json();
    if (json.items) {
        const chromiumPackage = json.items.find(({ name }) => name.includes('chrome-linux.zip'));
        if (chromiumPackage) {
            return chromiumPackage.mediaLink;
        }
    }
    return findPackage(basePosition-1);
};

const main = async () => {
    const versionToFind = parseInt(process.argv[2], 0);
    if (isValidVersion(versionToFind)) {
        const versionsByMajor = await getAllVersionTags();
        const versionTag = versionsByMajor[versionToFind];
        const basePosition = await getBasePosition(versionTag);
        const mediaLink = await findPackage(versionToFind, basePosition);
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
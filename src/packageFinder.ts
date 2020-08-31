import fetch from "node-fetch";

interface PackageItem {
  kind: string;
  mediaLink: string;
  name: string;
  size: string;
  updated: string;
  metadata: {
    "cr-commit-position": string;
    "cr-commit-position-number": string;
    "cr-git-commit": string;
  };
}

export const findPackage = async (basePosition: number): Promise<string> => {
  const fields =
    "items(kind,mediaLink,metadata,name,size,updated),kind,prefixes,nextPageToken";
  const res = await fetch(
    `https://www.googleapis.com/storage/v1/b/chromium-browser-snapshots/o?delimiter=/&prefix=Linux_x64/${basePosition}/&fields=${fields}`
  );
  const json = await res.json();
  if (json.items) {
    const chromiumPackage = json.items.find(({ name }: PackageItem) =>
      name.includes("chrome-linux.zip")
    );
    if (chromiumPackage) {
      return chromiumPackage.mediaLink;
    }
  }
  return findPackage(basePosition - 1);
};

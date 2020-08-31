import fetch from "node-fetch";

export const fetchChromiumTags = async (): Promise<string> => {
  const res = await fetch("https://chromium.googlesource.com/chromium/src.git/+refs");
  return res.text();
};

export interface BasePosition {
  chromium_version: string;
  skia_commit: string;
  chromium_base_position: string;
  v8_version: string;
  v8_commit: string;
  chromium_branch: string;
  v8_position: string;
  chromium_base_commit: string;
  chromium_commit: string;
}

export const fetchBasePosition = async (versionTag: string): Promise<BasePosition> => {
  const res = await fetch(`https://omahaproxy.appspot.com/deps.json?version=${versionTag}`);
  return res.json();
};

export interface PackageItem {
  kind: string;
  mediaLink: string;
  name: string;
  size: string;
  updated?: string;
  metadata?: {
    "cr-commit-position": string;
    "cr-commit-position-number": string;
    "cr-git-commit": string;
  };
}

export const lookupPackage = async (basePosition: number): Promise<{ items: PackageItem[] }> => {
  const fields = "items(kind,mediaLink,metadata,name,size,updated),kind,prefixes,nextPageToken";
  const res = await fetch(
    `https://www.googleapis.com/storage/v1/b/chromium-browser-snapshots/o?delimiter=/&prefix=Linux_x64/${basePosition}/&fields=${fields}`
  );
  return res.json();
};

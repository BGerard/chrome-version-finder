import { lookupPackage, PackageItem } from "./api";

export const findPackage = (getPackage: typeof lookupPackage) => async (
  basePosition: number
): Promise<PackageItem | string> => {
  const json = await getPackage(basePosition);
  if (json.items) {
    const chromiumPackage = json.items.find(({ name }: PackageItem) => name.includes("chrome-linux.zip"));
    if (chromiumPackage) {
      return chromiumPackage.mediaLink;
    }
  }
  return findPackage(getPackage)(basePosition - 1);
};

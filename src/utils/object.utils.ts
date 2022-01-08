export function getObjectValueByPath(obj: object, path: string): any {
  return path.split(".").reduce((acc, key) => {
    if (acc === undefined) {
      return undefined;
    }
    // @ts-ignore
    return acc[key];
  }, obj);
}

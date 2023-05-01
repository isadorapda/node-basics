export function createPath(path: string) {
  const regexParam = /:([a-zA-Z])+/g
  const pathWithParams = path.replaceAll(regexParam, `(?<id>[a-z0-9\\-_]+)`)
  const regextPath = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
  return regextPath
}

export function extractQueryParams(query: string) {
  return query
    .substring(1)
    .split('&')
    .reduce((queryParams, query) => {
      const [key, value] = query.split('=')
      queryParams[key] = value
      return queryParams
    }, {} as { [key: string]: string })
}

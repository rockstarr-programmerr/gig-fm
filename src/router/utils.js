export function prefixWith (prefix, routeConfigs) {
  return routeConfigs.map(routeConfig => {
    routeConfig.path = prefix + routeConfig.path
    return routeConfig
  })
}

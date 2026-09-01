// Groups OpenWeatherMap's icon codes into broad condition categories,
// shared by the condition badge, the animated background, and anywhere
// else that needs to style itself by "kind of weather" rather than the
// exact icon code.
export function conditionGroup(code) {
  const prefix = (code || '').slice(0, 2)
  switch (prefix) {
    case '01':
      return 'clear'
    case '02':
    case '03':
    case '04':
      return 'clouds'
    case '09':
    case '10':
      return 'rain'
    case '11':
      return 'storm'
    case '13':
      return 'snow'
    case '50':
      return 'mist'
    default:
      return 'clear'
  }
}

export function isNightCode(code) {
  return !!code && code.endsWith('n')
}

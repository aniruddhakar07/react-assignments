// Groups OpenWeatherMap icon codes into broad condition categories,
// shared by ConditionBadge (color) and WeatherBackground (animation).
export function conditionGroup(code) {
  const group = (code || '').slice(0, 2)
  switch (group) {
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

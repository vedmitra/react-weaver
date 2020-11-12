export function identity() {
}

export function maybe(func, $this?) {
  if (func) {
    const boundFunc = func.bind($this)
    return (...args) => boundFunc(...args)
  }
  return identity
}

export function isNullish(value: any): boolean {
  return value === undefined || value === null
}

export function isDate(value: any) {
  return typeof value?.getMonth === 'function'
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

export function isObject(value: any): boolean {
  return !isDate(value) && !isArray(value) && typeof value === 'object' && value !== null
}

export function isEmpty(value: any) {
  if (isObject(value)) {
    return Object.keys(value).length === 0
  }
  return isNullish(value) || value === ''
}

export function handleEvent(onChange, ...args) {
  return event => {
    if (event && event.preventDefault) {
      event.preventDefault()
    }
    const value = (event && event.target) ? event.target.value : event
    if (onChange) {
      onChange(value, ...args)
    }
  }
}

export function replaceValues(object, value) {
  return Object.keys(object).reduce((a, b) => ({...a, [b]: value}), {})
}

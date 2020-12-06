import {isObject} from './utils'

export interface IErrors {
  __form?: string,
  [x: string]: IErrors | string,
}

export function normalizeServerErrors(exception) {
  const errors: IErrors = {}
  const rawErrors: IErrors | string = exception.errors || exception.message || exception
  if (Array.isArray(rawErrors)) {
    // Keep only the first error.
    for (const rawError of rawErrors) {
      if (!errors.__form) {
        errors.__form = rawError
        return errors
      }
    }
  }
  else if (isObject(rawErrors)) {
    for (const [k, v] of Object.entries(rawErrors)) {
      errors[k] = v
    }
  }
  else {
    errors.__form = <string>rawErrors
  }
  return errors
}

export interface IErrors {
  __form?: string,
  [x: string]: IErrors | string,
}

export function normalizeServerErrors(exception) {
  const errors: IErrors = {}
  const rawErrors = exception.errors || exception || []
  for (const rawError of rawErrors) {
    if (!errors.__form) {
      errors.__form = rawError
    }
  }
  return errors
}

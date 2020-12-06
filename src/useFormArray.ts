import {useState, useMemo} from 'react'
import * as uuid from 'uuid'

import {isNullish, stripArray} from './utils'

interface IUseFormArray {
  minItems?: Number,
  onChange: Function,
  onError?: Function,
  value: any,
}

export function useFormArray(args: IUseFormArray) {
  const {minItems, onChange, onError} = args
  const value = buildValue(args?.value, minItems)
  const [errors, setErrors] = useState(value.map(v => null))
  const ctx = useMemo(() => ({
    ids: value.map(v => uuid.v4()),
  }), [])
  function handleChange(index, subValue) {
    onChange?.([
      ...value.slice(0, index),
      subValue,
      ...value.slice(index + 1),
   ])
  }
  function handleError(index, error) {
    const newErrors = [
      ...errors.slice(0, index),
      error,
      ...errors.slice(index + 1),
    ]
    setErrors(newErrors)
    onError?.(stripArray(newErrors))
  }
  function addForm() {
    ctx.ids = [
      ...ctx.ids,
      uuid.v4(),
    ]
    setErrors([
      ...errors,
      null,
    ])
    onChange?.([
      ...value,
      {},
    ])
  }
  function removeForm(index) {
    ctx.ids = [
      ...ctx.ids.slice(0, index),
      ...ctx.ids.slice(index + 1),
    ]
    const newErrors = [
      ...errors.slice(0, index),
      ...errors.slice(index + 1),
    ]
    setErrors(newErrors)
    onError?.(stripArray(newErrors))
    onChange?.([
     ...value.slice(0, index),
     ...value.slice(index + 1), 
   ])
  }
  return {
    formsArray: value.map((v, i) => ({
      key: ctx.ids[i],
      value: v,
      removeForm: () => removeForm(i),
      onChange: subValue => handleChange(i, subValue),
      onError: error => handleError(i, error),
    })),
    addForm,
  }
}

function buildValue(initialValue, minItems) {
  const value = isNullish(initialValue) ? [] : Array.isArray(initialValue) ? initialValue : [initialValue]
  if (isNullish(minItems)) {
    return value
  }
  if (value.length >= minItems) {
    return value
  }
  return [
    ...value,
    ...Array(minItems - value.length).fill({}),
  ]
}

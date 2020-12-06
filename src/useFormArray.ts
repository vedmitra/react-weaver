import {useMemo} from 'react'
import * as uuid from 'uuid'

import {isNullish} from './utils'

interface IUseFormArray {
  minItems?: Number,
  onChange: Function,
  onError?: Function,
  value: any,
}

export function useFormArray(args: IUseFormArray) {
  const {minItems, onChange, onError} = args
  const value = buildValue(args?.value, minItems)
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
  function addForm() {
    ctx.ids = [
      ...ctx.ids,
      uuid.v4(),
    ]
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
      onError,
    })),
    addForm,
  }
}

function buildValue(initialValue, minItems) {
  if (isNullish(minItems)) {
    return initialValue
  }
  const value = Array.isArray(initialValue) ? initialValue : []
  if (value.length >= minItems) {
    return value
  }
  return [
    ...value,
    Array(minItems - value.length).fill({}),
  ]
}

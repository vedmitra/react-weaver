import {useMemo} from 'react'
import * as uuid from 'uuid'

interface IUseFormArray {
  onChange: Function,
  onError?: Function,
  value: any,
}

export function useFormArray(args: IUseFormArray) {
  const {onChange, onError, value} = args
  const _value = value || []
  const ctx = useMemo(() => ({
    ids: _value.map(v => {id: uuid.v4()}),
  }), [])
  function handleChange(index, subValue) {
    onChange?.([
      ..._value.slice(0, index),
      subValue,
      ..._value.slice(index + 1),
   ])
  }
  function addForm() {
    ctx.ids = [
      ...ctx.ids,
      uuid.v4(),
    ]
    onChange?.([
      ..._value,
      {},
    ])
  }
  function removeForm(index) {
    ctx.ids = [
      ...ctx.ids.slice(0, index),
      ...ctx.ids.slice(index + 1),
    ]
    onChange?.([
     ..._value.slice(0, index),
     ..._value.slice(index + 1), 
   ])
  }
  return {
    formsArray: _value.map((v, i) => ({
      key: ctx.ids[i],
      value: v,
      removeForm: () => removeForm(i),
      onChange: (subValue) => handleChange(i, subValue),
      onError,
    })),
    addForm,
  }
}

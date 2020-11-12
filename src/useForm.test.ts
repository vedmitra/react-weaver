import {renderHook, act} from '@testing-library/react-hooks'
import * as yup from 'yup'

import {useForm} from './useForm'

describe('useForm', () => {
  it('values default to object', () => {
    const {result} = renderHook(() => useForm())
    const {values} = result.current
    expect(values).toMatchObject({})
  })

  it('fields default to empty string', () => {
    const {result} = renderHook(() => useForm())
    const {values} = result.current
    expect(values.test).toBe('')
  })

  it('update values as function', () => {
    const {result} = renderHook(() => useForm())
    let {values, updateValues} = result.current
    act(() => updateValues({hello: 'a', world: 'b'}))
    values = result.current.values
    expect(values).toMatchObject({hello: 'a', world: 'b'})
  })

  it('proxy updates fields', () => {
    const {result} = renderHook(() => useForm())
    let {values, updateValues} = result.current
    act(() => updateValues.hello('a'))
    values = result.current.values
    updateValues = result.current.updateValues
    expect(values).toMatchObject({hello: 'a'})
    act(() => updateValues.world('b'))
    values = result.current.values
    expect(values).toMatchObject({hello: 'a', world: 'b'})
  })

  it('returns proxies for all fields', () => {
    const {result} = renderHook(() => useForm())
    const {fieldProps} = result.current
    const testField = fieldProps.test
    expect(testField).toMatchObject({
      name: 'test',
      value: '',
      disabled: false,
    })
  })

  it('records whether fields have been touched', () => {
    const {result} = renderHook(() => useForm())
    const {fieldProps} = result.current
    act(() => fieldProps.test.onChange('a'))
    act(() => fieldProps.test.onBlur())
    const {touched} = result.current
    expect(touched.test).toEqual(true)
    expect(touched.missing).toEqual(undefined)
  })

  it('does not validate untouched fields', () => {
    const {result} = renderHook(() => useForm({validator: buildValidator()}))
    const {fieldProps} = result.current
    expect(fieldProps.test.error).toBeFalsy()
  })

  it('validates fields on blur', () => {
    const {result} = renderHook(() => useForm({validator: buildValidator()}))
    let fieldProps = result.current.fieldProps
    act(() => fieldProps.test.onChange('a'))
    fieldProps = result.current.fieldProps
    act(() => fieldProps.test.onChange(''))
    fieldProps = result.current.fieldProps
    act(() => fieldProps.test.onBlur())
    fieldProps = result.current.fieldProps
    expect(fieldProps.test.error).toMatch(/required/)
  })

  it('calls onError when validation occurs', () => {
    const onErrorMock = jest.fn()
    const {result} = renderHook(() => useForm({
      validator: buildValidator(),
      onError: onErrorMock,
    }))
    onErrorMock.mockClear()
    const {fieldProps} = result.current
    act(() => fieldProps.test.onBlur())
    expect(onErrorMock).toHaveBeenCalled()
  })

  it('calls onError when errors are set', () => {
    const onErrorMock = jest.fn()
    const {result} = renderHook(() => useForm({
      validator: buildValidator(),
      onError: onErrorMock,
    }))
    onErrorMock.mockClear()
    const {updateErrors} = result.current
    act(() => updateErrors())
    expect(onErrorMock).toHaveBeenCalled()
  })

  it('updates errors on first render', () => {
    const onErrorMock = jest.fn()
    const {result} = renderHook(() => useForm({
      validator: buildValidator(),
      onError: onErrorMock,
    }))
    expect(onErrorMock).toHaveBeenCalled()
  })
})

function buildValidator() {
  return yup.object().shape({
    test: yup.string().required(),
  })
}

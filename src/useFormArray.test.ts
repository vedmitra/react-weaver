import {renderHook, act} from '@testing-library/react-hooks'

import {useFormArray} from './useFormArray'

describe('useFormArray', () => {
  it('with no value has empty forms array', () => {
    const {result} = renderHook(() => useFormArray({
      onChange: () => ({}),
      value: null,
    }))
    const {formsArray} = result.current
    expect(formsArray).toEqual([])
  })

  it('with scalar value has single forms array element', () => {
    const {result} = renderHook(() => useFormArray({
      onChange: () => ({}),
      value: '1',
    }))
    const {formsArray} = result.current
    expect(formsArray.length).toEqual(1)
  })

  it('with array value has matching forms array elements', () => {
    const value = ['1', '2']
    const {result} = renderHook(() => useFormArray({
      onChange: () => ({}),
      value,
    }))
    const {formsArray} = result.current
    expect(formsArray.length).toEqual(value.length)
  })

  it('with minItems and no value, value has matching forms array elements', () => {
    const {result} = renderHook(() => useFormArray({
      onChange: () => ({}),
      value: null,
      minItems: 2,
    }))
    const {formsArray} = result.current
    expect(formsArray.length).toEqual(2)
  })

  it('with minItems and partial value, value has matching forms array elements', () => {
    const {result} = renderHook(() => useFormArray({
      onChange: () => ({}),
      value: '1',
      minItems: 2,
    }))
    const {formsArray} = result.current
    expect(formsArray.length).toEqual(2)
    expect(formsArray[0].value).toEqual('1')
  })

  it('with minItems and full value, value has matching forms array elements', () => {
    const {result} = renderHook(() => useFormArray({
      onChange: () => ({}),
      value: ['1', '2'],
      minItems: 2,
    }))
    const {formsArray} = result.current
    expect(formsArray.length).toEqual(2)
    expect(formsArray[0].value).toEqual('1')
    expect(formsArray[1].value).toEqual('2')
  })

  it('calls onChange with changed value', () => {
    const onChangeMock = jest.fn()
    const {result} = renderHook(() => useFormArray({
      onChange: onChangeMock,
      value: '1',
    }))
    result.current.formsArray[0].onChange('2')
    expect(onChangeMock).toHaveBeenCalledWith(['2'])
  })

  it('calls onError with error', () => {
    const onErrorMock = jest.fn()
    const {result} = renderHook(() => useFormArray({
      onChange: () => ({}),
      onError: onErrorMock,
      value: '1',
    }))
    act(() => result.current.formsArray[0].onError('fail'))
    expect(onErrorMock).toHaveBeenCalledWith(['fail'])
  })

  it('maintains errors of other elements', () => {
    const onErrorMock = jest.fn()
    const {result} = renderHook(() => useFormArray({
      onChange: () => ({}),
      onError: onErrorMock,
      value: ['1', '2'],
    }))
    act(() => result.current.formsArray[1].onError('fail2'))
    expect(onErrorMock).toHaveBeenCalledWith(['fail2'])
    onErrorMock.mockClear()
    act(() => result.current.formsArray[0].onError('fail1'))
    expect(onErrorMock).toHaveBeenCalledWith(['fail1', 'fail2'])
    onErrorMock.mockClear()
    act(() => result.current.formsArray[0].onError(null))
    expect(onErrorMock).toHaveBeenCalledWith(['fail2'])
  })
})

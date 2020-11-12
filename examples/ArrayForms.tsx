import * as React from 'react'
import * as yup from 'yup'
import {Block} from 'baseui/block'
import {HeadingMedium} from 'baseui/typography'
import {Input as BaseInput} from 'baseui/input'
import {Button} from 'baseui/button'

import {useForm} from '../src/useForm'
import {useFormArray} from '../src/useFormArray'

export function ArrayForms() {
  const {fieldProps, values} = useForm()
  return (
    <div>
      <HeadingMedium>Array forms</HeadingMedium>
      <Block display="flex">
        <div>
          <div>
            <Input {...fieldProps.topField0} />
          </div>
          <NestedFormArray {...fieldProps.nestedField} />
        </div>
        <div>
          {JSON.stringify(values)}
        </div>
      </Block>
    </div>
  )
}

function InnerNestedFormArray(props) {
  const {onChange, value} = props
  const {formsArray, addForm} = useFormArray({onChange, value})
  return (
    <>
      {formsArray.map(subProps => <NestedForm {...subProps} />)}
      <Button onClick={addForm}>Add</Button>
    </>
  )
}

const NestedFormArray = React.memo(InnerNestedFormArray)

function InnerNestedForm(props) {
  const {onChange, removeForm} = props
  const {fieldProps} = useForm({onChange})
  return (
    <div>
      <Input {...fieldProps.field0} />
      <Input {...fieldProps.field1} />
      <Button onClick={removeForm}>Remove</Button>
    </div>
  )
}

const NestedForm = React.memo(InnerNestedForm)

function InnerInput(props) {
  return (
    <Block width="250px">
      <BaseInput {...props} />
    </Block>
  )
}

const Input = React.memo(InnerInput)

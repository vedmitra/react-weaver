# React Weaver

![Build status](https://github.com/furious-luke/react-weaver/workflows/Test/badge.svg?branch=master)

React Forms that are good at nesting.

 * Designed with controlled inputs in mind.
 * Minimal rerendering, especially with deep nesting.
 * [Tiny bundle size](https://bundlephobia.com/result?p=react-weaver@0.0.3).

The [Sociable Weaver](https://en.wikipedia.org/wiki/Sociable_weaver)
is particularly good at nesting, just like React Weaver.

## Examples

You can run the examples with:

```bash
yarn examples
```

And then navigating to `http://localhost:3000`.

### Basic example

```typescript
import {useForm} from 'react-weaver'

function RegistrationForm() {
  const {fieldProps} = useForm()
  return (
    <form>
      <input {...fieldProps.username} />
      <input type="password" {...fieldProps.password} />
    </form>
  )
}
```

### Nesting

```typescript
import {useForm} from 'react-weaver'

function TopLevelForm() {
  const {fieldProps} = useForm()
  return (
    <form>
      <input {...fieldProps.field0} />
      <input {...fieldProps.field1} />
      <NestedForm {...fieldProps.nestedField} />
    </form>
  )
}

function NestedForm({value, onChange, onError}) {
  const {fieldProps} = useForm({value, onChange, onError})
  return (
    <form>
      <input {...fieldProps.field2} />
      <input {...fieldProps.field3} />
    </form>
  )
}
```

### Array fields

```typescript
import {useForm, useFormArray} from 'react-weaver'

function TopLevelForm() {
  const {fieldProps} = useForm()
  return (
    <form>
      <input {...fieldProps.field0} />
      <input {...fieldProps.field1} />
      <NestedFormArray {...fieldProps.nestedField} />
    </form>
  )
}

function NestedFormArray({value, onChange, onError}) {
  const {formsArray, addForm} = useFormArray({value, onChange, onError})
  return (
    <>
      {formsArray.map(subProps => <NestedForm {...subProps} />)}
      <button onClick={addForm}>Add</button>
    <>
  )
}

function NestedForm({onChange, removeForm}) {
  const {fieldProps} = useForm({value, onChange})
  return (
    <div>
      <input {...fieldProps.field2} />
      <input {...fieldProps.field3} />
      <button onClick={removeForm}>Remove</button>
    </div>
  )
}
```

### Validation with Yup

```typescript
import {useForm} from 'react-weaver'
import * as yup from 'yup'

function TopLevelForm() {
  const {fieldProps} = useForm({
    validator: yup.object().shape({
      field0: yup.string().required(),
    })
  })
  return (
    <form>
      <input {...fieldProps.field0} />
      <input {...fieldProps.field1} />
      <NestedForm {...fieldProps.nestedField} />
    </form>
  )
}

function NestedForm({value, onChange, onError}) {
  const {fieldProps} = useForm({
    value,
    onChange,
    onError,
    validator: yup.object().shape({
      field2: yup.string().required(),
    })
  })
  return (
    <form>
      <input {...fieldProps.field2} />
      <input {...fieldProps.field3} />
    </form>
  )
}
```

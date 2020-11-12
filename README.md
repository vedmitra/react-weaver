# React Weaver

React Forms that are good at nesting.

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

function NestedForm({onChange}) {
  const {fieldProps} = useForm({onChange})
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

function NestedFormArray({onChange, value}) {
  const {formsArray, addForm} = useFormArray({onChange, value})
  return (
    <>
      {formsArray.map(subProps => <NestedForm {...subProps} />)}
      <button onClick={addForm}>Add</button>
    <>
  )
}

function NestedForm({onChange, removeForm}) {
  const {fieldProps} = useForm({onChange})
  return (
    <div>
      <input {...fieldProps.field2} />
      <input {...fieldProps.field3} />
      <button onClick={removeForm}>Remove</button>
    </div>
  )
}
```

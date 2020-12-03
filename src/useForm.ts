import {useState, useEffect} from 'react'

import {useLocalContext} from './useLocalContext'
import {useProxy} from './useProxy'
import {normalizeServerErrors, IErrors} from './errors'
import {handleEvent, isEmpty, replaceValues, maybe, identity} from './utils'

interface IUseForm {
  initialValues?: object,
  onSubmit?: Function,
  onChange?: Function,
  onError?: Function,
  validator?: object,
  noPositive?: boolean,
}

interface IFieldProps {
  id: string | number | symbol,
  name: string | number | symbol,
  value: any,
  onChange: Function,
  disabled: boolean,
  onBlur: Function,
  error?: string,
  positive?: boolean,
}

/*
 * Create a new form instance.
 *
 * This simple hook uses JS proxies to prevent the need to know which
 * fields we might need ahead of time. The proxy for updating form
 * data values returns an updater function on-demand for the requested
 * property. It's prety neat.
 *
 * Usage looks something like this:
 *
 *   const initialValues = {first: 1, second: 2}
 *   const {fieldProps} = useForm({initialValues})
 *   return (
 *     <>
 *       <input {...fieldProps.first} />
 *       <input {...fieldProps.second} />
 *     </>
 *   )
 */
export function useForm(args: IUseForm = {}) {
  const {
    initialValues = {},
    onSubmit,
    onChange,
    onError = identity,
    validator,
    noPositive,
  } = args
  const [values, setValues] = useState(initialValues)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<IErrors>({})
  const [positive, setPositive] = useState({})
  const [touched, setTouched] = useState({})
  const [validating, setValidating] = useState({})
  const ctx: any = useLocalContext({values, errors, touched, onChange})
  // By using a proxy I'm able to automatically convert undefined
  // values to empty strings to prevent React from complaining without
  // having to pollute the form data with empty string values when
  // they're not actually intended.
  const valuesProxy: any = new Proxy(values, {
    get(target, name) {
      return target[name] !== undefined ? target[name] : ''
    },
  })
  // The errors proxy knows to hide errors for fields that aren't
  // touched yet.
  const errorsProxy: IErrors = new Proxy(errors, {
    get(target, name: string) {
      if (name === '__form') {
        return target[name]
      }
      return touched[name] ? target[name] : undefined
    },
  })
  function updateValues(changedValues) {
    const newValues = {...ctx.values, ...changedValues}
    setValues(newValues)
    validateValues(newValues)
    ctx.onChange?.(newValues)
  }
  // Another proxy here means I don't have to predict form fields
  // ahead of time in order to return a tailored updater function.
  const updateValuesProxy = useProxy(
    updateValues,
    name => handleEvent(value => updateValues({[name]: value})),
  )
  // Allow for easy updating of errors.
  function updateErrors(changedErrors) {
    const newErrors = {...ctx.errors, ...changedErrors}
    setErrors(newErrors)
    onError(buildErrorList(newErrors), values)
    setPositive(updatePositive(ctx.values, newErrors))
  }
  const updateErrorsProxy = useProxy(
    updateErrors,
    name => error => updateErrors({[name]: error}),
  )
  // Track which fields are currently validating.
  function updateValidating(changedValidating) {
    setValidating({...validating, ...changedValidating})
  }
  const updateValidatingProxy = new Proxy(updateValidating, {
    get(target, name: string) {
      return validating => updateValidating({[name]: validating})
    },
  })
  // Validate form field values using the validator.
  function validateValues(values) {
    if (!validator) {
      return
    }
    updateErrors(updateValidationErrors(validator, values))
  }
  const handleBlurProxy = useProxy(
    {},
    name => () => {
      setTouched({...ctx.touched, [name]: true})
      return validateValues(ctx.values)
    },
  )
  // Submit action. Submits the form using submitMutation.
  async function submit() {
    if (onSubmit) {
      setLoading(true)
      setErrors({})  // Clear any disconnected form errors
      try {
        await onSubmit(values)
      }
      catch (e) {
        setErrors(normalizeServerErrors(e))
        throw e
      }
      finally {
        setLoading(false)
      }
    }
  }
  // Generate a proxy to help populate fields. This gets used as a
  // shorthand to add all needed props to fields, such as `<Input
  // {...fieldProps.myField} />`.
  const fieldPropsProxy: any = new Proxy({}, {
    get(target, name: string) {
      const props: IFieldProps = {
        id: name,
        name,
        value: valuesProxy[name],
        onChange: updateValuesProxy[name],
        disabled: loading,
        onBlur: handleBlurProxy[name],
        error: errorsProxy[name],
      }
      if (!noPositive) {
        props.positive = positive[name]
      }
      return props
    }
  })
  // Force an initial validation step, this sets errors and postives.
  useEffect(() => {
    validateValues(values)
  }, [])
  return {
    fieldProps: fieldPropsProxy,
    submit,
    values: valuesProxy,
    updateValues: updateValuesProxy,
    loading,
    errors: errorsProxy,
    updateErrors: updateErrorsProxy,
    validating,
    updateValidating: updateValidatingProxy,
    touched,
    hasErrors: !!buildErrorList(errors),
    hasFieldErrors: !!buildErrorList(errors, true),
  }
}

function updatePositive(values, errors) {
  const newPositive = {}
  for (const [key, value] of Object.entries(values)) {
    newPositive[key] = !errors[key] && !isEmpty(value)
  }
  return newPositive
}

function updateValidationErrors(validator, values) {
  // Remove any pre-existing errors associated with the
  // validator. This leaves in any errors that have come from custom
  // error handling.
  let newErrors = replaceValues(validator.fields, null)
  try {
    validator.validateSync(values, {abortEarly: false})
  }
  catch (e) {
    if (e.name === 'ValidationError') {
      newErrors = e.inner.reduce((a, b) => {
        return {...a, [b.path]: b.message}
      }, newErrors)
    }
    else {
      throw e
    }
  }
  return newErrors
}

function buildErrorList(errors, skipFormErrors = false) {
  const errorList = []
  for (const [key, value] of Object.entries(errors)) {
    if (isEmpty(value)) {
      continue
    }
    if (key === '__form' && skipFormErrors) {
      continue
    }
    errorList.push(value)
  }
  return errorList.length ? errorList : null
}

import {useState} from 'react'

export function useLocalContext(data: object) {
  const [ctx] = useState({})
  Object.keys(data).forEach(key => {
    ctx[key] = data[key]
  })
  return ctx
}

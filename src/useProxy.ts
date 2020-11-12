import {useMemo} from 'react'

export function useProxy(host, handlerFactory) {
  const handlers: any = useMemo(() => ({}), [])
  return new Proxy(host, {
    get(target, name) {
      let handler = handlers[name]
      if (!handler) {
        handler = handlerFactory(name)
        handlers[name] = handler
      }
      return handler
    },
  })
}

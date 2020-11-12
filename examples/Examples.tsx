import * as React from 'react'
import {BaseProvider, LightTheme} from 'baseui'
import {Client as StyletronClient} from 'styletron-engine-atomic'
import {Provider as StyletronProvider} from 'styletron-react'

import {NestedForms} from './NestedForms'
import {ArrayForms} from './ArrayForms'

const engine = new StyletronClient()

export function Examples() {
  return (
    <Main>
      <ArrayForms />
      <NestedForms />
    </Main>
  )
}

function Main(props) {
  const {children} = props
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        {children}
      </BaseProvider>
    </StyletronProvider>
  )
}

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {Examples} from './Examples'

const element = document.createElement('div')
element.setAttribute('id', 'main-mount')
document.body.appendChild(element)
ReactDOM.render(<Examples />, element)

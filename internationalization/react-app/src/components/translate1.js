import React from 'react'
import PropTypes from 'prop-types'
import { compose, withProps, withState, withHandlers, lifecycle } from 'recompose'
import * as R from 'ramda'

export const withTranslate = compose(
  withState('translate', 'setTranslate', []),
  withHandlers({
    t: ({ translate, setTranslate }) => (translateStr) => {
      let newState = translate.slice()
      console.log(newState)
      newState.push(translateStr)
      setTranslate(newState)
    }
  }),
  lifecycle({
    shouldComponentUpdate() {
      return false
    }
  })
)

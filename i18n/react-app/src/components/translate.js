import React from 'react'
import PropTypes from 'prop-types'
import { compose, withContext, getContext, defaultProps, setDisplayName, renameProp, withProps } from 'recompose'
import * as R from 'ramda'

const Children = R.prop('children')
const defaultProp = (prop, value) => defaultProps({ [prop]: value })

const contextTypes = {
  _translate: PropTypes.arrayOf(PropTypes.string)
}

const getChildContext = ({ _translate, str, reset }) => ({
  _translate: reset ? str : _translate.concat(str)
})

export default compose(
  setDisplayName('Translate'),
  getContext(contextTypes),
  defaultProp('str', []),
  defaultProp('_translate', []),
  withContext(contextTypes, getChildContext),
  withProps((props) => console.log(props))
)(Children)

export const withTranslate = compose(
  getContext(contextTypes),
  renameProp('_translate', 'str'),
)

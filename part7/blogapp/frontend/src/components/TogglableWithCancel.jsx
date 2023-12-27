import PropTypes from 'prop-types'

import {Button} from 'react-bootstrap'

const TogglableWithCancel = (props) => {
  const hideWhenVisible = { display: props.visible ? 'none' : '' }
  const showWhenVisible = { display: props.visible ? '' : 'none' }

  const toggleVisibility = () => {
    props.setVisible(!props.visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button variant="success" size="sm" onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button variant="danger" size="sm" onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  )
}

TogglableWithCancel.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default TogglableWithCancel
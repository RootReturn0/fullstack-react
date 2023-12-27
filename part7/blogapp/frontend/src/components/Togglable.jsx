import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={props.style}>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.showButtonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        <button onClick={toggleVisibility}>{props.hideButtonLabel}</button>
        {props.children}
      </div>
    </div>
  )
}

export default Togglable
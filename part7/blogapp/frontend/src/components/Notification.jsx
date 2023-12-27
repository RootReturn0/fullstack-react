import { useSelector } from 'react-redux'

import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (!notification.content) {
    return null
  }

  return (
    <div>
      {notification.type === 'error' ? (
        <Alert variant="danger">{notification.content}</Alert>
      ) : (
        <Alert variant="success">{notification.content}</Alert>
      )}
    </div>
  )
}

export default Notification

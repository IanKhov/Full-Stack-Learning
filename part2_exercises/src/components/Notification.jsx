const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  const { message, type } = notification
  const className = type === 'success' ? 'notification success' : 'notification error'

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification
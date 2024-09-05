import React, { useState } from 'react'
import consumer from './cable'

const ChatRoom = () => {
  const [usernameField, setUsernameField] = useState('')
  const [messageField, setMessageField] = useState('')
  const [username, setUsername] = useState(null)
  const [channel, setChannel] = useState(null)
  const [messages, setMessages] = useState([])

  const login = () => {
    const channel = consumer.subscriptions.create({
      channel: 'ChatChannel',
      room: 'room',
      username: usernameField,
    }, {
      connected: () => console.log('connected'),
      disconnected: () => console.log('disconnected'),
      received: (data) => receiveMessage(data),
    })

    setChannel(channel)
    setUsername(usernameField)
  }

  const receiveMessage = (data) =>
    setMessages((previous) => [data, ...previous])

  const submitMessage = () => {
    if (messageField === '') return;

    const message = { from: username, message: messageField }
    channel.send(message)
    setMessageField('')
  }

  if (username) {
    return (
      <div>
        <div>
          <span>message ({username}): </span>
          <input name="message" value={messageField} onChange={(e) => setMessageField(e.target.value)} />
          <button type="submit" onClick={submitMessage}>Send</button>
        </div>

        <div>
          {messages.map(({ from, message }, index ) => (
            <p key={index}>
              <span style={{ fontWeight: 'bold' }}>{from}: </span>
              {message}
            </p>
          ))}
        </div>
      </div>
    )
  }

  return(
    <div>
      <span>username: </span>
      <input name="username" value={usernameField} onChange={(e) => setUsernameField(e.target.value)} />
      <button type="submit" onClick={login}>Log in</button>
    </div>
  )
}

export default ChatRoom

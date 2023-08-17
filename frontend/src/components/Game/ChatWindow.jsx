import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import classNames from 'classnames';

const ChatWindow = ({ sendMessage, messages, playerId }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!inputMessage) return;

    sendMessage(inputMessage);
    setInputMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="mt-4">
      <div
        style={{
          border: '1px solid #eee',
          padding: '0px',
          borderRadius: '10px'
        }}
      >
        <ListGroup
          className="p-1"
          style={{ height: '200px', overflow: 'hidden' }}
        >
          {messages.map((message, index) => (
            <ListGroup.Item
              key={index}
              className={classNames(
                `text-${message.player.id === playerId ? 'end' : 'start'}`,
                'text-xxs',
                'border-0',
                'py-1',
                'px-2'
              )}
              style={{
                background:
                  parseInt(message.player.id) === parseInt(playerId)
                    ? '#fafafa'
                    : '#fff'
              }}
            >
              <span
                className={
                  parseInt(message.player.id) === parseInt(playerId)
                    ? 'text-primary'
                    : 'text-success'
                }
              >
                {parseInt(message.player.id) !== parseInt(playerId) && (
                  <strong>{message.player.name}: </strong>
                )}
                {message.message}
              </span>
            </ListGroup.Item>
          ))}
          <div ref={messagesEndRef} />
        </ListGroup>
        <form onSubmit={handleSendMessage} id="game-chat">
          <div className="mt-1 input-group-sm input-group">
            <input
              type="text"
              className="shadow-none form-control chat-form-control"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <Button
              variant="secondary"
              className="mb-0 chat-form-button text-xxs"
              style={{ borderRadius: '0px 0px 10px 0px !important' }}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

ChatWindow.defaultProps = {
  messages: []
};

export default ChatWindow;

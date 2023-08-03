import React, { useState } from 'react';
import { Container, Row, Col, ListGroup, InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import classNames from 'classnames';


const ChatWindow = ({sendMessage, messages, playerId}) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!inputMessage) return;

    sendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div>
        <ListGroup>
            { messages.map((message, index) => (
                <ListGroup.Item key={index} className={classNames(
                    `text-${message.player.id === playerId ? 'end' : 'start'}`,
                    'text-xxs', 'border-0', 'py-0', 'mb-1'
                )}>
                    <span className={parseInt(message.player.id) === parseInt(playerId) ? 'text-primary' : 'text-success'}>
                       { parseInt(message.player.id) !== parseInt(playerId) &&
                            <strong>{ message.player.name }: </strong>
                       }
                       {message.message}
                    </span>
                </ListGroup.Item>
            )) }
        </ListGroup>
        <Form onSubmit={handleSendMessage}>
            <InputGroup className="mt-3 input-group-sm">
                <FormControl
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <Button variant="outline-secondary" className='mb-0' onClick={handleSendMessage}>
                    Send
                </Button>
            </InputGroup>
        </Form>
        
    </div>
      
  );
};

ChatWindow.defaultProps = {
    messages: [],
};

export default ChatWindow;
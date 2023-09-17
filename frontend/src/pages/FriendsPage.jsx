import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import {
  inviteFriend,
  removeFriend,
  getFriends,
  searchUserByString
} from '../services/api';

function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //   const navigate = useNavigate();

  const handleSearchChange = async (inputValue) => {
    if (inputValue.length >= 3) {
      try {
        const matchedUsers = await searchUserByString(inputValue);
        setUsers(matchedUsers);
      } catch (err) {
        console.log(err);
      }
    } else {
      setUsers([]);
    }
    return inputValue;
  };

  const handleRemove = async (friendId) => {
    const result = removeFriend(friendId);
  };

  const handleFriendInvite = (friendId) => {
    const result = inviteFriend(friendId);
  };

  return (
    <section className="min-vh-80 mb-8">
      <div className="page-header min-height-300 align-items-start min-vh-50 pt-5 pb-11 mx-3 border-radius-lg">
        <span className="mask bg-gradient-secondary opacity-6"></span>
      </div>
      <div className="container">
        <Card className="card-body blur shadow-blur mx-4 mt-n4 overflow-hidden">
          <h4 className="text-xs mb-0">Friends list</h4>
        </Card>
      </div>
      <div className="container mt-6">
        <Row>
          <Col size="12">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {friends.map((friend) => (
                  <tr key={friend.id}>
                    <td>{friend.name}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleRemove(friend.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <Select
                options={users}
                placeholder="Add a friend..."
                onChange={() => {}}
                onInputChange={handleSearchChange}
                isSearchable
              />
              {isLoading && <p>Loading...</p>}
              <Button
                variant="primary"
                className="mt-2"
                onClick={handleFriendInvite}
              >
                Invite via Facebook/Email
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}

export default FriendsPage;

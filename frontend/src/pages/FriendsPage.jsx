import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import {
  Col,
  Row,
  InputGroup,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
  Card
} from 'react-bootstrap';
import {
  inviteFriend,
  removeFriend,
  getFriends,
  getInvitations,
  searchUserByString
} from '../services/api';
import { useAlert } from '../components/shared/Alert/AlertContext';

function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([
    { value: 'chocolate', label: 'Chocolate' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [facebookInvite, setFacebookInvite] = useState('');
  const [invitationsReceived, setInvitationsReceived] = useState([]);
  const [invitationsSent, setInvitationsSent] = useState([]);

  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchFriends = async () => {
      const result = await getFriends();
      setFriends(result.data.friends);
    };

    const fetchInvitations = async () => {
      const result = await getInvitations();
      setInvitationsReceived(result.data.friend_invitations.received);
      setInvitationsSent(result.data.friend_invitations.sent);
    };

    fetchInvitations();
    fetchFriends();
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 3 && searchTerm.trim() !== '') {
      const fetchUsers = async () => {
        try {
          const result = await searchUserByString(searchTerm);
          const friends = result.data.players.map((friend) => ({
            value: friend.id,
            label: friend.name
          }));
          setUsers(friends);
        } catch (err) {
          console.log(err);
        }
      };

      fetchUsers();
    }
  }, [searchTerm]);

  const handleSearchChange = (inputValue, { action, prevInputValue }) => {
    if (action === 'input-change') {
      if (inputValue.length >= 3 && inputValue.trim() !== '') {
        setSearchTerm(inputValue);
      } else {
        setSearchTerm('');
      }
      return inputValue;
    }
    return prevInputValue;
  };

  const handleOnChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const handleRemove = async (friendId) => {
    try {
      const result = await removeFriend(friendId);
      showAlert('Success', `Removed ${friendId} from friends list!`, null, {
        variant: 'success',
        position: 'bottom'
      });
    } catch (error) {
      showAlert('Error', `Failed to remove ${friendId}. Please try again.`);
    }
  };

  const handleFriendInvite = useCallback(async () => {
    if (!selectedOption) {
      showAlert('Error', 'Please select a friend to invite.', null, {
        variant: 'danger',
        position: 'bottom'
      });
      return;
    }

    const friendId = selectedOption[0].value;

    try {
      const result = await inviteFriend(friendId);
      showAlert('Success', `Invited ${friendId} successfully!`, null, {
        variant: 'success',
        position: 'bottom'
      });
    } catch (error) {
      showAlert('Error', `Failed to invite ${friendId}. Please try again.`);
    }
  }, [selectedOption]);

  const handleFacebookInvite = useCallback(async () => {
    try {
      const result = await inviteFriend(facebookInvite);
      showAlert('Success', `Invited ${facebookInvite} successfully!`, null, {
        variant: 'success'
      });
    } catch (error) {
      showAlert(
        'Error',
        `Failed to invite ${facebookInvite}. Please try again.`
      );
    }
  }, [facebookInvite]);

  return (
    <section className="min-vh-80 mb-8">
      <div className="page-header min-height-300 align-items-start min-vh-50 pt-5 pb-11 mx-3 border-radius-lg">
        <span className="mask bg-gradient-secondary opacity-6" />
      </div>
      <div className="container mt-6">
        <Row>
          <Col sm={6}>
            <FormGroup>
              <FormLabel>Add a friend</FormLabel>
              <InputGroup>
                <Select
                  className="flex-grow-1"
                  options={users}
                  isMulti={true}
                  placeholder="Search..."
                  onChange={handleOnChange}
                  onInputChange={handleSearchChange}
                  value={selectedOption}
                  isSearchable
                />
                <Button
                  variant="primary"
                  onClick={handleFriendInvite}
                  className="mb-0"
                >
                  Invite
                </Button>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup>
              <FormLabel>Invite via Facebook/Email</FormLabel>
              <InputGroup>
                <FormControl
                  placeholder="Enter email or Facebook ID"
                  value={facebookInvite}
                  onChange={(e) => setFacebookInvite(e.target.value)}
                />
                <Button
                  variant="primary"
                  className="mb-0"
                  onClick={handleFacebookInvite}
                >
                  Invite
                </Button>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <Row className="mt-4">
          {friends.map((friend) => (
            <Col sm={4} key={friend.id}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>{friend.name}</Card.Title>
                  <Button
                    variant="danger"
                    onClick={() => handleRemove(friend.id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row className="mt-4">
          {invitationsReceived.map((friend, index) => (
            <Col sm={4} key={index}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>{friend.name}</Card.Title>
                  <Button
                    variant="danger"
                    onClick={() => handleRemove(friend.id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row className="mt-4">
          {invitationsSent.map((friend, index) => (
            <Col sm={4} key={index}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>{friend.name}</Card.Title>
                  <Button
                    variant="danger"
                    onClick={() => handleRemove(friend.id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}

export default FriendsPage;
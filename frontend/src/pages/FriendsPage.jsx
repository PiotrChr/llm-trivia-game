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
  acceptFriend,
  declineFriend,
  getFriends,
  getInvitations,
  searchUserByString
} from '../services/api';
import { useAlert } from '../components/shared/Alert/AlertContext';
import { Jumbo } from '../components/Layout/Jumbo';

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
          const players = result.data.players
            .filter((player) => {
              return !friends.some((friend) => friend.id === player.id);
            })
            .map((player) => ({
              value: player.id,
              label: player.name
            }));
          setUsers(players);
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

  const handleDecline = async (friendId) => {
    try {
      const result = await declineFriend(friendId);
      showAlert('Success', `Declined ${friendId} successfully!`, null, {
        variant: 'success'
      });
    } catch (error) {
      showAlert('Error', `Failed to decline ${friendId}. Please try again.`);
    }
  };

  const handleAccept = async (friendId) => {
    try {
      const result = await acceptFriend(friendId);
      showAlert('Success', `Accepted ${friendId} successfully!`, null, {
        variant: 'success'
      });
    } catch (error) {
      showAlert('Error', `Failed to accept ${friendId}. Please try again.`);
    }
  };

  const handleRemoveInvitation = async (friendId) => {
    try {
      const result = await removeInvitation(friendId);
      showAlert('Success', `Removed ${friendId} successfully!`, null, {
        variant: 'success'
      });
    } catch (error) {
      showAlert('Error', `Failed to remove ${friendId}. Please try again.`);
    }
  };

  return (
    <div>
      <Jumbo url="/static/img/jumbotron/friends/1.png" scrollToContent={true} />
      <section>
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
            <h3>Friends</h3>
            {friends.map((friend) => (
              <Col sm={4} key={friend.id}>
                <Card className="mb-4">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{friend.name}</Card.Title>
                    <Button
                      variant="danger"
                      onClick={() => handleRemove(friend.player_id)}
                    >
                      Remove
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Row className="mt-4">
            <h3>Invitations received</h3>
            {invitationsReceived.map((friend, index) => (
              <Col sm={4} key={index}>
                <Card className="mb-4">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{friend.name}</Card.Title>
                    <Button
                      variant="danger"
                      onClick={() => handleDecline(friend.player_id)}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => handleAccept(friend.player_id)}
                    >
                      Accept
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Row className="mt-4">
            <h3>Invitations sent</h3>
            {invitationsSent.map((friend, index) => (
              <Col sm={4} key={index}>
                <Card className="mb-4">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{friend.name}</Card.Title>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveInvitation(friend.player_id)}
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
    </div>
  );
}

export default FriendsPage;

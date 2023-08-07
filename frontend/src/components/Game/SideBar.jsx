import React from 'react'
import { Row } from 'react-bootstrap';
import ChatWindow from './ChatWindow';

const Sidebar = ({ players, messages, sendMessage, playerId }) => (
    <div className="sidebar">
      <Row>
        <div className="table-responsive">
          <table className="table align-items-center mb-0">
            <thead>
              <tr>
                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  Player
                </th>
                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  Status
                </th>
                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              { players && players.map((player) => {
                return (
                  <tr key={player.id}>
                    <td>
                      <div className="d-flex px-2 py-1">
                        {/* <div>
                          <img src={player.avatar} className="avatar avatar-sm me-3" />
                        </div> */}
                        <div className="d-flex flex-column justify-content-center">
                          <h6 className="mb-0 text-sm">{player.name}</h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm font-weight-bold mb-0">
                        {player.ready ? (
                          <span className="badge badge-sm bg-gradient-success">Ready</span>
                        ) : (
                          <span className="badge badge-sm bg-gradient-danger">Not Ready</span>
                        )}
                      </p>
                    </td>
                    <td>
                      <p className="text-sm font-weight-bold mb-0">{player.points}</p>
                    </td>
                  </tr>
                )
              }) }
            </tbody>
          </table>
        </div>
      </Row>
      <Row>
        <ChatWindow sendMessage={sendMessage} messages={messages} playerId={playerId}/>
      </Row>
    </div>
  );

  export default Sidebar;
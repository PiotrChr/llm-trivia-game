import React from 'react';
import { Row } from 'react-bootstrap';
import ChatWindow from './ChatWindow';

const Sidebar = ({ players, messages, sendMessage, playerId }) => (
  <div className="sidebar">
    <Row>
      <div className="table-responsive">
        <table className="table align-items-center mb-0">
          <thead>
            <tr className="text-center">
              <th className="text-uppercase text-justify text-secondary text-xxs font-weight-bolder opacity-7 p-1">
                Player
              </th>
              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-1">
                Status
              </th>
              <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-1">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {players &&
              players.map((player) => {
                return (
                  <tr key={player.id}>
                    <td className="p-1 border-0">
                      <div className="d-flex">
                        <div className="d-flex flex-column justify-content-center">
                          <h6 className="mb-0 text-xs">{player.name}</h6>
                        </div>
                      </div>
                    </td>
                    <td className="p-1 border-0">
                      <p className="text-sm font-weight-bold mb-0 text-xxs text-center">
                        {player.ready ? (
                          <span className="badge badge-sm bg-gradient-success">
                            Ready
                          </span>
                        ) : (
                          <span className="badge badge-sm bg-gradient-danger">
                            Not Ready
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="p-1 border-0 text-center text-center">
                      <p className="text-sm font-weight-bold mb-0">
                        {player.points}
                      </p>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Row>
    <Row>
      <ChatWindow
        sendMessage={sendMessage}
        messages={messages}
        playerId={playerId}
      />
    </Row>
  </div>
);

export default Sidebar;

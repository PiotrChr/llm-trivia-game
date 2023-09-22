import React, { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import ChatWindow from './ChatWindow';
import Collapse from '../shared/Collapse';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Sidebar = ({ players, messages, sendMessage, playerId }) => {
  const [shouldCollapse, setShouldCollapse] = useState(
    window.innerWidth <= 768
  );
  const [shouldShowChevron, setShouldShowChevron] = useState(
    window.innerWidth <= 768
  );

  const handleWindowResize = () => {
    setShouldCollapse(window.innerWidth <= 768);
    setShouldShowChevron(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div className="sidebar">
      <Row>
        <Collapse
          title="Players"
          forceCollapse={shouldCollapse}
          showChevron={shouldShowChevron}
        >
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
        </Collapse>
      </Row>
      <Row>
        <Collapse
          title="Chat"
          forceCollapse={shouldCollapse}
          showChevron={shouldShowChevron}
        >
          <ChatWindow
            sendMessage={sendMessage}
            messages={messages}
            playerId={playerId}
          />
        </Collapse>
      </Row>
    </div>
  );
};

export default Sidebar;

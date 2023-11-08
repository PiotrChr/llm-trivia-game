import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { getGames } from '../services/api';
import { useAuth } from '../routing/AuthProvider';
import { Col, Row } from 'react-bootstrap';
import { Jumbo } from '../components/Layout/Jumbo';
import { useTranslation } from 'react-i18next';

function GameListPage() {
  const [games, setGames] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchGames = async () => {
      const result = await getGames();
      console.log(result.data);

      setGames(result.data);
    };

    fetchGames();
  }, []);

  const handleJoin = async (gameId) => {
    navigate('/game/join/' + gameId);
  };

  const handleConnect = (gameId) => {
    a;
    navigate('/game/' + gameId);
  };

  const handleViewStats = (gameId) => {
    navigate('/game/' + gameId + '/stats');
  };

  const hasJoined = (game) => {
    return game.players.some((player) => player.player_id === user.id);
  };

  const BtnConnect = ({ game }) => {
    if (hasJoined(game)) {
      return (
        <Button
          variant="outline-primary"
          onClick={() => handleConnect(game.id)}
          className="btn-round btn-sm mb-0 mt-2 mt-lg-0"
        >
          Connect
        </Button>
      );
    } else {
      return (
        <Button
          variant="outline-success"
          onClick={() => handleJoin(game.id)}
          className="btn-round btn-sm mb-0 mt-2 mt-lg-0"
        >
          Join
        </Button>
      );
    }
  };

  const BtnViewStats = ({ game }) => {
    return (
      <Button
        variant="outline-secondary"
        onClick={() => handleViewStats(game.id)}
        className="btn-round btn-sm mb-0 mt-2 mt-lg-0"
      >
        View Stats
      </Button>
    );
  };

  return (
    <div>
      <Jumbo
        url="/static/img/jumbotron/list-games/1.jpg"
        scrollToContent={true}
      ></Jumbo>
      <section className="min-vh-80 mb-8">
        <div className="container">
          <Card className="card-body blur shadow-blur mx-4 mt-n4 overflow-hidden">
            <h4 className="text-xs mb-0">{t('game_list.title')}</h4>
          </Card>
        </div>
        <div className="container mt-6">
          <Row>
            <Col size="12">
              <table className="table align-items-center mb-0">
                <thead>
                  <tr className="d-none d-md-table-row">
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">
                      {t('common.game_id')}
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">
                      {t('common.host')}
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">
                      {t('common.game_mode')}
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">
                      {t('common.category')}
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">
                      {t('common.players')}
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 align-middle text-center text-sm">
                      {t('common.status')}
                    </th>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"></th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => {
                    return (
                      <tr key={game.id}>
                        <td className="d-none d-md-table-cell">
                          <h6 className="mb-0 text-xs">{game.id}</h6>
                        </td>
                        <td className="align-middle text-center text-sm d-none d-md-table-cell">
                          <h6 className="mb-0 text-xs">
                            {
                              game.players.filter(
                                (player) => player.player_id === game.host
                              )[0].name
                            }
                          </h6>
                        </td>
                        <td className="align-middle text-center text-sm d-none d-md-table-cell">
                          <h6 className="mb-0 text-xs">{game.mode.name}</h6>
                        </td>
                        <td className="align-middle text-center text-sm d-none d-md-table-cell">
                          <h6 className="mb-0 text-xs">
                            {game.all_categories
                              ? 'All'
                              : game.current_category.name}
                          </h6>
                        </td>
                        <td className="align-middle text-center text-sm d-none d-md-table-cell">
                          <h6 className="mb-0 text-xs">
                            {game.players.length}
                          </h6>
                        </td>
                        <td className="align-middle text-center text-sm d-none d-md-table-cell">
                          {game.time_start && !game.time_end && (
                            <span className="badge badge-sm bg-gradient-warning">
                              {t('common.in_progress')}
                            </span>
                          )}
                          {game.time_start && game.time_end && (
                            <span className="badge badge-sm bg-gradient-success">
                              {t('common.finished')}
                            </span>
                          )}
                          {!game.time_start && !game.time_end && (
                            <span className="badge badge-sm bg-gradient-primary">
                              {t('common.waiting')}
                            </span>
                          )}
                        </td>
                        <td className="align-middle text-center text-sm d-none d-md-table-cell">
                          <BtnConnect game={game} />
                        </td>
                        <td className="p-1 border-0 d-md-none">
                          <strong>{t('common.game_id')}: </strong>
                          {game.id} <br />
                          <strong>{t('common.category')}: </strong>
                          {game.current_category.name} <br />
                          <strong>{t('common.players')}: </strong>
                          {game.players.length} <br />
                          <strong>{t('common.status')}: </strong>
                          {game.time_start && !game.time_end && (
                            <span className="badge badge-sm bg-gradient-warning">
                              {t('common.in_progress')}
                            </span>
                          )}
                          {game.time_start && game.time_end && (
                            <span className="badge badge-sm bg-gradient-success">
                              {t('common.finished')}
                            </span>
                          )}
                          {!game.time_start && !game.time_end && (
                            <span className="badge badge-sm bg-gradient-primary">
                              {t('common.waiting')}
                            </span>
                          )}
                          <br />
                          <BtnConnect game={game} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}

export default GameListPage;

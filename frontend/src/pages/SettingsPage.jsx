import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getProfileStats } from '../services/api';
import { Jumbo } from '../components/Layout/Jumbo';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Jumbo
        url="/static/img/jumbotron/settings/1.jpg"
        scrollToContent={true}
      />
      <section className="min-vh-80 mb-8">
        <Container className="mt-6">
          <Row>
            <Col size="12">
              <div className="stats-page">
                <h1>{t('seettings.title')}</h1>
                <p>
                  This is the settings page. Game functionality will be added
                  here later.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default SettingsPage;

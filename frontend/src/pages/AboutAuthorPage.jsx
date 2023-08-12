import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../routing/AuthProvider';
import { Col, Row } from 'react-bootstrap';

function AboutAuthorPage() {
  const [leaders, setLeaders] = useState([]);
  
  const navigate = useNavigate();
  const { user } = useAuth();


  return (
    <section className="min-vh-80 mb-8">
      <div
        className="page-header min-height-300 align-items-start min-vh-50 pt-5 pb-11 mx-3 border-radius-lg"
        style={{borderRadius: '0px 0px 24px 24px' }}
      >
        <span className="mask bg-gradient-secondary opacity-6"></span>
      </div>
      <div className="container">
        <Card className='card-body blur shadow-blur mx-4 mt-n4 overflow-hidden'>
          <h4 className="text-xs mb-0">Game list</h4>
        </Card>
      </div>
      <div className="container mt-6">
        <Row>
          <Col size="12">
            {/* Content */}
          </Col>
        </Row>
      </div>
    </section>
  );
}

export default AboutAuthorPage;
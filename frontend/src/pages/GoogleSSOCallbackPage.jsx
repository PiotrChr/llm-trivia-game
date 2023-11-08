import React, { useEffect } from 'react';

const GoogleSSOCallbackPage = ({}) => {
  useEffect(() => {
    const handleSSOCallback = async () => {
      const credentials = await window.google.accounts.id.getAuthResponse();

      console.log(credentials);
    };

    window.google?.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleSSOCallback
    });

    window.google?.accounts.id.prompt(); // Display the One Tap prompt
  }, []);

  return <div>Loading ...</div>;
};

export default GoogleSSOCallbackPage;

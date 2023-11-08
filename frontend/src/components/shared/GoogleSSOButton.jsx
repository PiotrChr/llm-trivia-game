import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const GoogleSSOButton = ({ onClick }) => {
  const { t } = useTranslation();

  useEffect(() => {
    console.log(process.env.APP_GOOGLE_CLIENT_ID);

    console.log(process.env.GOOGLE_SSO_CALLBACK_URL);

    window.google?.accounts.id.initialize({
      client_id: process.env.APP_GOOGLE_CLIENT_ID,
      ux_mode: 'redirect',
      login_uri: process.env.GOOGLE_SSO_CALLBACK_URL
    });

    window.google?.accounts.id.renderButton(
      document.getElementById('signInDiv'),
      { theme: 'outline', size: 'large' }
    );
  }, []);

  return <div id="signInDiv" className="mt-1" />;
};

GoogleSSOButton.defaultProps = {
  onClick: () => {}
};

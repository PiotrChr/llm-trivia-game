import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { authGoogle } from '../../services/api';

export const GoogleSSOButton = ({ callback }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const onSignIn = async (googleUser) => {
      const id_token = googleUser.credential;
      const response = await authGoogle(id_token);

      if (response.status === 200) {
        console.log(response.data);

        callback(response.data.access_token, response.data.refresh_token);
      }
    };

    window.google?.accounts.id.initialize({
      client_id: process.env.APP_GOOGLE_CLIENT_ID,
      callback: onSignIn
    });

    window.google?.accounts.id.renderButton(
      document.getElementById('signInDiv'),
      {
        theme: 'outline',
        size: 'large'
      }
    );
  }, []);

  return <div id="signInDiv" className="mt-1" />;
};

GoogleSSOButton.defaultProps = {
  callback: () => {}
};

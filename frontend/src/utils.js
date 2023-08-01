import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import manifest from '../manifest.json';

export const decode = (token) => {
    return jwt_decode(token);
}

export const checkJWT = () => {
    const token = Cookies.get('token');
    
    if (!token) {
      return false;
    }

    try {
        const decodedToken = decode(token);
  
        if (decodedToken.exp < Date.now() / 1000) {
          Cookies.remove('token');
        } else {
          return decodedToken;
        }
      } catch (err) {
        Cookies.remove('token');
        return false;
      }

    return false;
}

export const getRandomBackground = (categoryId) => {
  const directoryName = String(categoryId).padStart(3, '0');
  const imagePaths = manifest[directoryName] || [];

  if (imagePaths.length === 0) return null;

  const randomImage = imagePaths[Math.floor(Math.random() * imagePaths.length)];

  return randomImage;
}
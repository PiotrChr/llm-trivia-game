import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

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

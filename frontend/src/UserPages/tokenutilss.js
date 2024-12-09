export const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  
  export const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      const decodedToken = decodeToken(token);
      if (!decodedToken) return false;
      
      // Check if token is expired
      return decodedToken.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };
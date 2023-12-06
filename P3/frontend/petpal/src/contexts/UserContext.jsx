// UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shelters, setShelters] = useState({})

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginUser = (userData) => {
    console.log('logged in', userData)
    setUser(userData);
  };

  const logoutUser = () => {
    console.log('loged out')
    setUser(null);
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      fetchShelters();
    }
  }, [user]);

  const fetchShelters = async () => {
    let url = 'http://127.0.0.1:8000/accounts/shelters'

    try {
      const authToken = localStorage.getItem('access_token')
      const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
      });
      const obj = {}
      response.data.map((shelter) => {
        obj[shelter['id']] = shelter
      })
      setShelters(obj);
      console.log(obj)
    }
    catch {
      setShelters({})
    }
}
  

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, shelters }}>
      {children}
    </UserContext.Provider>
  );
};
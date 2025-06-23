import { createContext, useContext, useState } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
  try {
    const result = await loginUser(email, password);

    if (!result) throw new Error('Login failed');

    // ✅ Store user and token
    setUser({
      ...result.user,
      token: result.token,
    });

  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
};

  return (
    <AuthContext.Provider value={{ user, setUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
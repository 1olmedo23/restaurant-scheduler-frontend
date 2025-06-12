const BASE_URL = 'http://192.168.0.8:5000/api';

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user; // ✅ Return only the user object
  } catch (err) {
    console.error(err);
    return null;
  }
};


export const getMySchedule = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/my-schedule`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    return data.schedule || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};
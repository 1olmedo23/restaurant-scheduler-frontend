const BASE_URL = 'http://192.168.0.8:5000/api';

export const loginUser = async (email, password) => {
  try {
    //console.log('🔍 Sending login request with:', { email, password });

    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    //console.log('🔁 Raw response status:', res.status);

    if (!res.ok) {
      const error = await res.text(); // could also try res.json() safely
      //console.error('❌ Login failed with status:', res.status, 'Message:', error);
      return null;
    }

    const data = await res.json();
    //console.log('✅ Login successful:', data);

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
      },
      token: data.token,
    };
  } catch (err) {
    //console.error('❌ Network or parsing error:', err);
    return null;
  }
};

export const getEmployeeAvailability = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/availability`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to fetch availability');

    const data = await res.json();
    return data.availability || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const submitAvailability = async (token, availability) => {
  const url = `${BASE_URL}/availability`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(availability)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit availability');
  }

  return await response.json();
};

export const getMySchedule = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/my-schedule`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();
    return data;  // Return full response object
  } catch (err) {
    console.error(err);
    return { schedule: [] };  // Fallback shape for consistency
  }
};

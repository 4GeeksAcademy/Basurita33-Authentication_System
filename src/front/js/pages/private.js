import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Private = () => {
  const history = useHistory();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      history.push('/login');
    }
  }, [history]);

  return (
    <div>
      <h2>Private Dashboard</h2>
      <p>Only for the eyes of a few.</p>
    </div>
  );
};

export default Private;
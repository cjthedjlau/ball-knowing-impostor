import React, { useEffect } from 'react';

const UserNotRegisteredError = () => {
  useEffect(() => {
    window.location.replace('/');
  }, []);

  return null;
};

export default UserNotRegisteredError;
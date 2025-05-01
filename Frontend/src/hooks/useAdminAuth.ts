import { useState, useEffect } from 'react';
import { getAdmin } from '../utils/auth';

export const useAdminAuth = () => {
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    setAdmin(getAdmin());
  }, []);

  return { admin };
};

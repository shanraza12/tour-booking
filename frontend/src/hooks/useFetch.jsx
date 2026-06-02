import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/config';

const useFetch = (endpoint, queryParams) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')); 
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await axios.get(`${"http://localhost:4000/api/v1"}/${endpoint}`, {
          params: queryParams,
          headers: {
            Authorization: user?.token ? `Bearer ${user?.token}` : '', // Only add if token exists
            // You can add other default headers here if needed
          },
        });
        setData(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, queryParams]);

  return {
    data,
    error,
    loading,
  };
};

export default useFetch;

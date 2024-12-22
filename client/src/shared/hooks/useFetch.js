import { useEffect, useState } from "react";

export const useFetch = (method, url, sentData, dataType) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (method, url, sentData, dataType) => {
      if (method.toUpperCase() === "GET") {
        try {
          setLoading(true);
          const response = await fetch(url);

          const response_data = await response.json();
          if (response.ok === true) {
            setData(response_data);
            setLoading(false);
          } else {
            setData(null);
            setLoading(false);
          }
        } catch (error) {
          setData(null);
          setLoading(false);
          console.error(error);
        }
      } else if (method.toUpperCase() === "POST") {
        setLoading(true);
        let payload;
        if (dataType.toLowerCase() === "json") {
          payload = {
            mehtod: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sentData),
          };
        } else if ("mixed") {
          payload = {
            mehtod: "POST",
            body: sentData,
          };
        }
        try {
          const response = await fetch(url, payload);

          const response_data = await response.json();
          if (response.ok === true) {
            setData(response_data);
            setLoading(false);
          } else {
            setLoading(false);
            return null;
          }
        } catch (error) {
          setLoading(false);
          console.error(error);
        }
      }
    };
    fetchData(method, url, sentData, dataType);
  }, [method, url, sentData, dataType]);
  return [data, loading];
};

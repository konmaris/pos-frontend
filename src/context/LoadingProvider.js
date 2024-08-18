import React, { useEffect, useState } from "react";
import LoadingContext from "./LoadingContext";

const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //console.log({ loading });
  }, [loading]);

  return <LoadingContext.Provider value={{ loading, setLoading }}>{children}</LoadingContext.Provider>;
};

export default LoadingProvider;

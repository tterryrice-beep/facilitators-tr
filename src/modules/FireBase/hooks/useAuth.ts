import { instances } from "@/config/instances";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [Auth, setAuth] = useState(() => {
    const fb = instances.fb();
    return fb.getState().user;
  });

  useEffect(() => {
    const rm = instances.fb?.().listen("user", setAuth);

    return () => {
      rm();
    };
  }, []);

  return Auth || null;
};

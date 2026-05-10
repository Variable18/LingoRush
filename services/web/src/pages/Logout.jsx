import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("lingorush_token");
    localStorage.removeItem("lingorush_user");
    navigate("/login");
  }, [navigate]);
  return null;
}

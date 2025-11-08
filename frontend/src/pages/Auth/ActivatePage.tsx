import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { activate } from "../../lib/api";

const ActivatePage: React.FC = () => {
  const navigate = useNavigate();
  const { pincode, JWT } = useParams<{ pincode: string; JWT: string }>();

  useEffect(() => {
    async function runActivation() {
      if (!pincode || !JWT) {
        alert("Activation link is invalid.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        await activate(pincode, JWT);
        alert("Account was activated, now login to your account");
        navigate("/login", { replace: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Activation failed";
        alert(message);
        navigate("/login", { replace: true });
      }
    }

    void runActivation();
  }, [JWT, navigate, pincode]);

  return null;
};

export default ActivatePage;

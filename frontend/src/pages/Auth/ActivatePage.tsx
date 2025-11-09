import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { activate } from "../../lib/api";
import { notifyError, notifySuccess } from "../../lib/notify";

const ActivatePage: React.FC = () => {
  const navigate = useNavigate();
  const { pincode, JWT } = useParams<{ pincode: string; JWT: string }>();

  useEffect(() => {
    async function runActivation() {
      if (!pincode || !JWT) {
        notifyError("Activation failed", "Activation link is invalid.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        await activate(pincode, JWT);
        notifySuccess("Account activated", "You can now login in.");
        navigate("/login", { replace: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Activation failed";
        notifyError("Activation failed", message);
        navigate("/login", { replace: true });
      }
    }

    void runActivation();
  }, [JWT, navigate, pincode]);

  return null;
};

export default ActivatePage;

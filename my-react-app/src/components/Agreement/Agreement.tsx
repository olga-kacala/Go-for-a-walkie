
import React, { useState } from "react";
import Modal from "react-modal";

type AgreementModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  onAgree: () => void;
};


export const AgreementModal: React.FC<AgreementModalProps> = ({ isOpen, onRequestClose, onAgree }) => {
    const [cookiesAgreed, setCookiesAgreed] = useState(false);
    const [geolocationAgreed, setGeolocationAgreed] = useState(false);

  const handleAgree = () => {
    if (cookiesAgreed && geolocationAgreed) {
      onAgree();
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Cookie and Geolocation Agreement</h2>
      <label>
        <input
          type="checkbox"
          checked={cookiesAgreed}
          onChange={() => setCookiesAgreed(!cookiesAgreed)}
        />
        I agree to use cookies.
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={geolocationAgreed}
          onChange={() => setGeolocationAgreed(!geolocationAgreed)}
        />
        I agree to share my geolocation.
      </label>
      <br />
      <button onClick={handleAgree}>Agree</button>
    </Modal>
  );
};

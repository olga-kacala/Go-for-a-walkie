import Modal from "react-modal";

type AgreementModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  onAgree: () => void;
};

export const AgreementModal: React.FC<AgreementModalProps> = ({
  isOpen,
  onRequestClose,
  onAgree,
}) => {
  const handleAgree = () => {
    onAgree();
  };

  const handleDontAgree = () => {
    onAgree();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div>
        <h2>Privacy Notice</h2>

        <h3>Thank you for using Walkie!</h3>

        <p>
          This Privacy Notice explains how we collect, use, and share
          information when you use our app. By using our app, you agree to the
          collection and use of information in accordance with this policy.
        </p>

        <h3>Information We Collect:</h3>

        <p>
          Geolocation Data: We collect your device's geolocation data to enhance
          your experience with our app. This information is solely used to set
          up Google Maps for your location and is not shared with any third
          parties.
        </p>
        <h3>How We Use Your Information:</h3>

        <p>
          We use the collected geolocation data for the sole purpose of
          improving the functionality of our app. This information is used to
          accurately display Google Maps for your specific location.
        </p>
        <h3>Information Sharing and Security:</h3>

        <p>
          We do not share your geolocation data with any third parties. Your
          privacy and the security of your information are important to us. We
          take reasonable measures to protect your information from unauthorized
          access or disclosure.
        </p>

        <h3>Your Choices:</h3>

        <p>
          You can choose to disable geolocation services on your device, but
          please note that this may affect the functionality of our app.
        </p>
      </div>

      <button onClick={handleAgree}>I agree to share my geolocation</button>
      <button onClick={handleDontAgree}>
        I DON'T agree to share my geolocation
      </button>
    </Modal>
  );
};

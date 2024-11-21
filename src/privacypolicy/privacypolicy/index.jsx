import React from "react";

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Privacy Policy</h1>
      <p>
        Last updated: <strong>{new Date().toLocaleDateString()}</strong>
      </p>
      <p>
        This Privacy Policy explains how we collect, use, disclose, and
        safeguard your information when you visit our website or use our
        services.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We may collect personal information that you provide to us, such as your
        name, email address, phone number, and other contact details. We may
        also collect non-personal information, such as your browser type,
        operating system, and browsing behavior on our site.
      </p>

      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide and maintain our services.</li>
        <li>Improve and personalize your experience on our website.</li>
        <li>Communicate with you about updates, offers, and promotions.</li>
        <li>Ensure the security of our website and services.</li>
      </ul>

      <h2>Sharing Your Information</h2>
      <p>
        We do not sell, trade, or rent your personal information to third
        parties. However, we may share your information with trusted service
        providers who assist us in operating our website and services, as long
        as they agree to keep your information confidential.
      </p>

      <h2>Your Choices</h2>
      <p>
        You can choose to limit the information you provide to us or opt-out of
        certain communications. However, this may affect your ability to use
        certain features of our website or services.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at: <strong>support@kumbhtsmonitoring.in</strong>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
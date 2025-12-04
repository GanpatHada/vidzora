import React from 'react';

const OtpScreen: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <h2>Enter OTP</h2>
      <p>A One-Time Password has been sent to your number.</p>
      {/* Add OTP input fields here */}
      <button>Submit</button>
    </div>
  );
};

export default OtpScreen;

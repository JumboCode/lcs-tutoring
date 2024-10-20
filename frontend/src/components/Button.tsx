import React from 'react';

interface ButtonProps {
  label: string;  
  onClick: () => void;  
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  const buttonStyle = {
    backgroundColor: '#FF13F0',
    color: 'red',
    padding: '10px 10px',
    border: '20px solid yellow',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '200px',
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;

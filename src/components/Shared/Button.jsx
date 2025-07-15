import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  button {
    padding: 12px 20px;
    border-radius: 15px;
    color: #212121;
    border: none;
    z-index: 1;
    background: #e8e8e8;
    position: relative;
    font-weight: 700;
    font-size: 17px;
    -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
    box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
    transition: all 250ms;
    overflow: hidden;
    cursor: pointer;
  }

  button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    border-radius: 15px;
    background-color: #FE7743;
    z-index: -1;
    transition: all 250ms;
  }

  button:hover {
    color: #e8e8e8;
  }

  button:hover::before {
    width: 100%;
  }
`;

const Button = ({ label = "Click Me", onClick, type = "button", className = '', ...rest }) => {
  return (
    <StyledWrapper>
      <button type={type} onClick={onClick} className={className} {...rest}>
        {label}
      </button>
    </StyledWrapper>
  );
};

export default Button;

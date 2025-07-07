import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  button {
   --border-radius: 30px;
   --border-width: 3px;
   appearance: none;
   position: relative;
   padding: 10px 24px;
   border: 0;
   font-size: 18px;
   font-weight: 500;
   z-index: 2;
  }

  button::after {
   --m-i: linear-gradient(#000, #000);
   --m-o: content-box, padding-box;
   content: "";
   position: absolute;
   left: 0;
   top: 0;
   width: 100%;
   height: 100%;
   padding: var(--border-width);
   border-radius: var(--border-radius);
   background-image: conic-gradient(
        #24dceb,
  		#e96d2a,
  		#2a53e9,
  		#18da20,
        #eb2433
  	);
   -webkit-mask-image: var(--m-i), var(--m-i);
   mask-image: var(--m-i), var(--m-i);
   -webkit-mask-origin: var(--m-o);
   mask-origin: var(--m-o);
   -webkit-mask-clip: var(--m-o);
   mask-composite: exclude;
   -webkit-mask-composite: destination-out;
   filter: hue-rotate(0);
   animation: rotate-hue linear 1500ms infinite;
   animation-play-state: running;
  }

  button:hover::after {
   animation-play-state: paused;
  }

  @keyframes rotate-hue {
   to {
    filter: hue-rotate(1turn);
   }
  }

  button,
  button::after {
   box-sizing: border-box;
  }

  button:active {
   --border-width: 5px;
  }`;

const Button2 = ({ label = "Click Me", onClick, type = "button", className, ...rest }) => {
    return (
        <StyledWrapper>
            <button onClick={onClick} type={type} className={className} {...rest}>
                {label}
            </button>
        </StyledWrapper>
    );
}

export default Button2;

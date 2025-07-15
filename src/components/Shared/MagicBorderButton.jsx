import React from "react";
import "./MagicBorderButton.css";

const MagicBorderButton = ({ label = "Click Me", onClick }) => {
    return (
        <button className="magic-border-btn" onClick={onClick}>
            <span className="text">{label}</span>
        </button>
    );
};

export default MagicBorderButton;

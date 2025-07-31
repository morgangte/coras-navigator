import React from 'react';

import './button.css';

function getTypeClass(type) {
    switch(type) {
        case "cta": return " button--call-to-action";
        case "small": return " button--small";
        default: return " ";
    }
}

const Button = ({ link, text, type, minWidth }) =>
    <div className={"button" + getTypeClass(type)} style={ minWidth ? { minWidth } : null}>{text}</div>;

export default Button;
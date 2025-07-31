import React from 'react';
import { HashRouter, Route, Link } from 'react-router-dom'; 

import './frontpageactions.css';
import Button from '../../atoms/Button/Button.jsx';

const FrontPageActions = () =>
        <nav className="fp-actions">
            <div className="fp-left">
            </div>
            <div className="fp-right">
                <Link to='/try-it'>
                    <Button text="Try CORAS" type="cta" minWidth="11rem" />
                </Link>
            </div>
        </nav>;

export default FrontPageActions;
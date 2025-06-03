import React from 'react';
import { HashRouter, Link } from 'react-router-dom'; 

import './keypoints.css';

/*
            <div>
                <Link to={link}>
                    <div className="key-point__read-more-link">Read more <span className="icon-push-down icon-circle-right"></span></div>
                </Link>
            </div>
*/

const KeyPoint = ({ header, text, links }) =>
        <div className="key-point">
            <header>
                <h1 className="key-point__header">{header}</h1>
            </header>
            <p className="key-point__description">
                {text}
            </p>
            <br />
            {links.length !== 0 
            ? links.map((link, key) => 
            <div key={key}>
                <a className="key-point__read-more-link" href={link.href}>{link.text}<span className="icon-push-down icon-circle-right"></span></a>    
            </div> 
            ) 
            : null}
        </div>

const KeyPoints = ({ keyPoints }) =>
    <div className="key-points">
        {keyPoints.map((val, key) => <KeyPoint header={val.header} text={val.text} links={val.links} key={key} />)}
    </div>

export default KeyPoints;
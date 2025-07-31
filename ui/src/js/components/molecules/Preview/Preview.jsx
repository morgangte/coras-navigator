import React from 'react';
import { Link } from 'react-router-dom'; 


import './preview.css';
import assetD from '../../../../img/asset_example_tweaked.svg';
import threatD from '../../../../img/threat_example_tweaked.svg';
import Button from '../../atoms/Button/Button.jsx';


const Preview = ({ tagLine }) =>
    <div className="preview">
        <div className="preview-wrapper">    
            <div className="preview-left">
                <div className="preview-image-wrapper">
                    <img className="preview-left__image" src={assetD} />
                </div>
            </div>
            <div className="preview-middle">
                <p className="coras-title">CORAS</p>
                <p className="coras-subtitle">A risk modeling approach</p>
                <Link className="preview-middle-button" to='/try-it'>
                    <Button text="Try CORAS" type="cta" minWidth="11rem" />
                </Link>
                <Link className="preview-middle-button" to='/navigator'>
                    <Button text="CORAS Navigator" type="cta" minWidth="11rem" />
                </Link>
            </div>
            <div className="preview-right">
                <div className="preview-image-wrapper">
                    <img className="preview-right__image" src={threatD} />
                </div>
            </div>
        </div>
    </div>;

export default Preview;
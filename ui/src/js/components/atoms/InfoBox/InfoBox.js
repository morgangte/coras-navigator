import React, { useState } from 'react';
import Information from './Information';
import { useSelector } from 'react-redux';
import './InfoBox.css';
 

const InfoBox = (props) => {
    const pos = useSelector(state => state.editor.infoBox.position);
    const category = useSelector(state => state.editor.infoBox.category);
    const id = useSelector(state => state.editor.infoBox.id);


    const parse = () => {
        //var c = Information[category];
        //var i = c[id];
        console.log(`category`, category)
        console.log(`id`, id)
        console.log(Information[category][id].description)
        return Information[category][id].description;
    }

    const parseId = (id) => {}

    return (
        <div className="infobox_content" style={{ left: pos.x, top: pos.y }}>
            <div className="infobox_header">
                <h4>{id.charAt(0).toUpperCase() + id.replace(/_/g, ' ').slice(1)}</h4>
            </div>
            <hr/>
            <div className="infobox_body">
                <p>{Information[category][id].description}</p> 
            </div>
            <div className="infobox_footer">
            </div>
        </div>
    )
} 

export default InfoBox;
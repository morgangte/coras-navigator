import React, { useRef } from 'react';
import "./fileupload.css";

function FileUpload({ title, onFileSelect, disabled }) {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        if (disabled) return;

        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        if (disabled) return;

        const file = event.target.files[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}/>
            <button className={disabled ? "load-button disabled" : "load-button"} onClick={handleButtonClick}>{title}</button>
        </div>
    );
}

export default FileUpload;

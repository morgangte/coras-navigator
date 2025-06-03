import React, { useRef } from 'react';
import "./fileupload.css";

function FileUpload({ onFileSelect }) {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}/>
            <button className='load-button' onClick={handleButtonClick}>Upload a file</button>
        </div>
    );
}

export default FileUpload;

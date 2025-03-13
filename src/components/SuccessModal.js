import React from 'react';
import './SuccessModal.css'; // New CSS file

function SuccessModal({ isOpen, onClose, message, invitationCode }) {
    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(invitationCode);
        alert('Invitation code copied to clipboard!');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Success</h3>
                <p>{message}</p>
                <p><strong>Invitation Code:</strong> {invitationCode}</p>
                <button onClick={handleCopy} className="copy-button">Copy Code</button>
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
}

export default SuccessModal;        
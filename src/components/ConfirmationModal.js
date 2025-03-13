// client/src/components/ConfirmationModal.js
import React, { useEffect, useRef } from 'react';
import './ConfirmationModal.css'; // Create this CSS file

function ConfirmationModal({ isOpen, message, onConfirm, onCancel }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onCancel(); // Close the modal if clicked outside
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onCancel]);


    if (!isOpen) {
        return null; // Don't render anything if not open
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="confirm-button">Confirm</button>
                    <button onClick={onCancel} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
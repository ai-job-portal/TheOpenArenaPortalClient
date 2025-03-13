// client/src/components/Toast.js
import React from 'react';
import './Toast.css'; // Create this CSS file

function Toast({ toast }) {
    if (!toast.isVisible) {
        return null; // Don't render anything if not visible
    }

    return (
        <div className={`toast-container toast-${toast.type}`}>
            <div className="toast-message">{toast.message}</div>
        </div>
    );
}

export default Toast;
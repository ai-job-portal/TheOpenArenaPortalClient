// client/src/hooks/useToast.js
import { useState, useCallback } from 'react';

const useToast = () => {
    const [toast, setToast] = useState({
        message: '',
        isVisible: false,
        type: 'success',
    });

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        setToast({
            message,
            isVisible: true,
            type,
        });

        setTimeout(() => {
            setToast({
                message: '',
                isVisible: false,
                type: 'success', // Reset to default
            });
        }, duration);
    }, []);

    return { toast, showToast };
};

export default useToast; // Corrected export
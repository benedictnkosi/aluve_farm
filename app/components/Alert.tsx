import React from 'react';

const Alert = ({ message, type }: { message: string, type: string }) => {
    const baseStyles = 'p-4 rounded-md mb-4';
    const typeStyles: { [key: string]: string } = { // Add index signature to typeStyles object
        info: 'bg-blue-50 text-blue-700',
        success: 'bg-green-50 text-green-700',
        warning: 'bg-yellow-50 text-yellow-700',
        error: 'bg-red-50 text-red-700',
    };

    return (
        <div className={`${baseStyles} ${typeStyles[type]}`}>
            {message}
        </div>
    );
};

export default Alert;
import React from "react";
import { FaUserPlus, FaSignInAlt, FaSignOutAlt, FaCalendarCheck, FaCreditCard, FaUserEdit, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";

export const getActivityIcon = (activityType) => {
    const iconMap = {
        'sign-up': FaUserPlus,
        'login': FaSignInAlt,
        'logout': FaSignOutAlt,
        'booking': FaCalendarCheck,
        'payment': FaCreditCard,
        'profile-update': FaUserEdit,
        'reservation': FaCalendarAlt,
    };

    const IconComponent = iconMap[activityType] || FaInfoCircle;
    return React.createElement(IconComponent, { className: "text-green-500" });
};


export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

export const getDeviceInfo = (userAgent, ipAddress) => {
    if (!userAgent) return 'Unknown Device';

    // Extract main browser and OS info
    let device = '';

    // Browser detection
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        device += 'Chrome';
    } else if (userAgent.includes('Firefox')) {
        device += 'Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        device += 'Safari';
    } else if (userAgent.includes('Edg')) {
        device += 'Edge';
    } else {
        device += 'Browser';
    }

    // OS detection
    if (userAgent.includes('Windows')) {
        device += ' (Win)';
    } else if (userAgent.includes('Mac')) {
        device += ' (Mac)';
    } else if (userAgent.includes('Linux')) {
        device += ' (Linux)';
    } else if (userAgent.includes('Android')) {
        device += ' (Android)';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        device += ' (iOS)';
    } else {
        device += ' (OS)';
    }

    return device;
};

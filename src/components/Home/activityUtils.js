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
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
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

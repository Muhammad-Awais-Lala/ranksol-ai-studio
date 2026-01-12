import axios from 'axios';
import { API_BASE_URL } from '../../constants';

export const logUserVisit = async () => {
    const visitLogged = localStorage.getItem('visit_logged');

    if (visitLogged) {
        const lastVisit = parseInt(visitLogged, 10);
        const twentyFourHours = 24 * 60 * 60 * 1000;

        // If it's a valid timestamp and less than 24 hours have passed, do not log
        if (!isNaN(lastVisit) && (Date.now() - lastVisit < twentyFourHours)) {
            return;
        }
    }

    try {
        // Simple Browser Detection
        const getBrowserName = () => {
            const userAgent = navigator.userAgent;
            if (userAgent.includes("Firefox")) return "Firefox";
            if (userAgent.includes("SamsungBrowser")) return "Samsung Internet";
            if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
            if (userAgent.includes("Trident")) return "Internet Explorer";
            if (userAgent.includes("Edge")) return "Edge";
            if (userAgent.includes("Chrome")) return "Chrome";
            if (userAgent.includes("Safari")) return "Safari";
            return "Unknown";
        };

        const browserName = getBrowserName();
        const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';

        // Collect IP and Location
        // let ipData: any = {};
        // try {
        //     const response = await axios.get('https://ipwho.is/');
        //     if (response.data.success !== false) {
        //         ipData = response.data;
        //     } else {
        //         console.warn('IP lookup failed:', response.data.message);
        //     }
        // } catch (error) {
        //     console.warn('Failed to fetch IP data:', error);
        // }

        const logData = {
            browser_name: browserName,
            device_type: deviceType,
            visit_timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            // ip_address: ipData.ip || 'Unknown',
            // location: ipData.city ? `${ipData.city}, ${ipData.country}` : 'Unknown',
        };

        console.log('User visit logged successfully', logData);

        // Send to Backend
        if (API_BASE_URL) {
            await axios.post(`${API_BASE_URL}/get-user-ip`, logData);
        }
        // Mark as visited
        // Mark as visited with timestamp
        localStorage.setItem('visit_logged', Date.now().toString());

    } catch (error) {
        console.error('Error logging user visit:', error);
    }
};

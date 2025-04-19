import axios from "axios";
import { useEffect, useState } from "react";

export default function useAnalytics() {
    const [desktopCount, setDesktopCount] = useState(0);
    const [mobileCount, setMobileCount] = useState(0);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analytics/track}`, {
                    withCredentials: true,
                });

                setDesktopCount(response.data.desktop);
                setMobileCount(response.data.mobile);
            } catch (error) {
                console.error("Erro ao buscar dados de análise", error);
            }
        };

        fetchAnalytics();
    }, []);

    return { desktopCount, mobileCount };
}
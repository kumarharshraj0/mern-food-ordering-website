import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useDelivery } from '../context/DeliveryContext';

export const useDeliveryTracking = () => {
    const socket = useSocket();
    const { user } = useAuth();
    const { updateLocation } = useUser();
    const { isAvailable } = useDelivery();

    useEffect(() => {
        if (!user || !user.roles?.includes('deliveryBoy') || !socket || !isAvailable) return;

        console.log("STARTING DELIVERY TRACKING (ONLINE)...");

        const trackLocation = () => {
            if (!navigator.geolocation) return;

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    // 1. Update in DB (for persistence/admin view)
                    try {
                        await updateLocation(latitude, longitude);
                    } catch (err) {
                        console.error("Failed to sync location to DB", err);
                    }

                    // 2. Emit via socket (for real-time assignment logic in backend memory)
                    socket.emit('updateLocation', {
                        userId: user._id,
                        latitude,
                        longitude
                    });
                },
                (err) => console.error("Location tracking error:", err),
                { enableHighAccuracy: true }
            );
        };

        // Initial track
        trackLocation();

        // Interval tracking every 30 seconds
        const intervalId = setInterval(trackLocation, 30000);

        return () => {
            console.log("STOPPING DELIVERY TRACKING...");
            clearInterval(intervalId);
        };
    }, [user, socket]);
};

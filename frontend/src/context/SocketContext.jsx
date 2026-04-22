import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        // Initialize socket connection
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://mern-food-ordering-website.onrender.com';
        const newSocket = io(socketUrl, {
            withCredentials: true,
        });

        setSocket(newSocket);

        // Connection events
        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            if (user) {
                newSocket.emit('joinDelivery', { userId: user._id });
            }
        });

        // Handle order status updates
        newSocket.on('orderStatusUpdate', (data) => {
            // Only show toast if the update is for the current user
            if (user && data.userId === user._id) {
                const statusMessages = {
                    confirmed: "Your order has been confirmed! ✅",
                    preparing: "Your meal is being prepared! 🍳",
                    out_for_delivery: "Your food is on the way! 🛵",
                    delivered: "Enjoy your meal! Your food has been delivered. 🍱",
                    cancelled: "Your order was cancelled. ❌",
                };

                const message = statusMessages[data.status] || `Order status updated to: ${data.status}`;
                toast(message, {
                    duration: 5000,
                    position: 'top-right',
                });
            }
        });

        // DELIVERY BOY NOTIFICATIONS
        newSocket.on('deliveryAssigned', (data) => {
            if (user && user.roles?.includes('deliveryBoy')) {
                toast.success(`New Delivery Assigned! 📦\nOrder #${data.orderId.slice(-6)}`, {
                    duration: 6000,
                    position: 'top-center',
                    icon: '🚀'
                });
            }
        });

        newSocket.on('deliveryUpdate', (data) => {
            if (user && user.roles?.includes('deliveryBoy')) {
                toast(data.message, { icon: 'ℹ️' });
            }
        });

        // LIVE TRACKING FOR CUSTOMERS
        newSocket.on('deliveryLocationUpdate', (data) => {
            // dispatch a custom event that OrderDetailsPage can listen to
            window.dispatchEvent(new CustomEvent('deliveryLocationUpdate', { detail: data }));
        });

        // MARKETPLACE EVENTS
        newSocket.on('newOrderAvailable', (data) => {
            if (user && user.roles?.includes('deliveryBoy')) {
                toast.success(`Broadcasting: New Order Available! 🛒\n${data.restaurant} - ₹${data.total}`, {
                    duration: 8000,
                    icon: '📢'
                });
                window.dispatchEvent(new CustomEvent('newOrderAvailable', { detail: data }));
            }
        });

        newSocket.on('orderClaimed', (data) => {
            window.dispatchEvent(new CustomEvent('orderClaimed', { detail: data }));
        });

        return () => {
            newSocket.close();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);

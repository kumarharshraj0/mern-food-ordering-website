import React from "react";
import GenericDashboardLayout from "../layout/GenericDashboardLayout";
import DeliverySidebar from "./DeliverySidebar";
import { useDeliveryTracking } from "../../hooks/useDeliveryTracking";

const DeliveryLayout = ({ children }) => {
    useDeliveryTracking();
    return (
        <GenericDashboardLayout sidebar={DeliverySidebar}>
            {children}
        </GenericDashboardLayout>
    );
};

export default DeliveryLayout;

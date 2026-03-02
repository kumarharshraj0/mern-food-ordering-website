import Sidebar from "./Sidebar"
import GenericDashboardLayout from "./GenericDashboardLayout";

export default function Layout({ children }) {
  return (
    <GenericDashboardLayout sidebar={Sidebar} title="Food Admin">
      {children}
    </GenericDashboardLayout>
  )
}


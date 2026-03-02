import OwnerSidebar from "../ownerlayout/Sidebar";






export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-orange-50">
      <OwnerSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

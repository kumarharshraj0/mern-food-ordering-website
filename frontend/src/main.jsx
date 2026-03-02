import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { RestaurantProvider } from './context/RestaurantContext'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'
import { MenuProvider } from './context/MenuContext'
import { UserProvider } from './context/UserContext'
import { DeliveryProvider } from './context/DeliveryContext'
import { SocketProvider } from './context/SocketContext'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Toaster position="top-center" reverseOrder={false} toastOptions={{ style: { zIndex: 99999 } }} />
    <SocketProvider>
      <CartProvider>
        <RestaurantProvider>
          <OrderProvider>
            <MenuProvider>
              <UserProvider>
                <DeliveryProvider>
                  <App />
                </DeliveryProvider>
              </UserProvider>
            </MenuProvider>
          </OrderProvider>
        </RestaurantProvider>

      </CartProvider>
    </SocketProvider>
  </AuthProvider>
)

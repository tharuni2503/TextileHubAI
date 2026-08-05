import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import NotFound from "../pages/NotFound";

import BuyerDashboard from "../pages/Buyer/Dashboard";
import SupplierDashboard from "../pages/Supplier/Dashboard";

import Marketplace from "../pages/Buyer/Marketplace";
import ProductDetails from "../pages/Buyer/ProductDetails";
import Cart from "../pages/Buyer/Cart";
import Orders from "../pages/Buyer/Orders";

import Products from "../pages/Supplier/Products";
import AddProduct from "../pages/Supplier/AddProduct";
import EditProduct from "../pages/Supplier/EditProduct";
import SupplierOrders from "../pages/Supplier/Orders";
import Wishlist from "../pages/Buyer/Wishlist";
import BuyerProfile from "../pages/Buyer/Profile";
import SupplierProfile from "../pages/Supplier/Profile";

import PricePredictor from "../pages/Supplier/PricePredictor";
import Checkout from "../pages/Buyer/Checkout";
import Analytics from "../pages/Supplier/Analytics";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Buyer Routes */}
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/buyer/cart" element={<Cart />} />
        <Route path="/buyer/orders" element={<Orders />} />
        <Route path="/buyer/wishlist" element={<Wishlist />} />
        <Route path="/buyer/profile" element={<BuyerProfile />} />
        
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Supplier Routes */}
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        <Route path="/supplier/products" element={<Products />} />
        <Route path="/supplier/add-product" element={<AddProduct />} />
        <Route path="/supplier/edit-product/:id" element={<EditProduct />} />
        <Route path="/supplier/orders" element={<SupplierOrders />} />
        <Route path="/supplier/analytics" element={<Analytics />} />
        <Route path="/supplier/price-predictor" element={<PricePredictor />} />
        <Route path="/supplier/profile" element={<SupplierProfile />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
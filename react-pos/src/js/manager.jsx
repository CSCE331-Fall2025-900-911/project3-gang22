import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./manager-components/navbar.jsx";
import Table from "./manager-components/table.jsx";

const HEADERS = [
  { display: "Menu ID", key: "id" },
  { display: "Drink Name", key: "name" },
  { display: "Price", key: "price" },
  { display: "Image", key: "image" }
];

const MENU = [
    { id:1, name:'Classic Black Milk Tea with Boba', price:4.50, image:'/images/drink1-3.jpg' },
    { id:2, name:'Jasmine Green Milk Tea with Boba', price:4.75, image:'/images/drink1-3.jpg' },
    { id:3, name:'Oolong Milk Tea with Boba', price:4.95, image:'/images/drink1-3.jpg' },
    { id:4, name:'Taro Milk Tea with Boba', price:5.25, image:'/images/drink4.jpg' },
    { id:5, name:'Thai Milk Tea with Boba', price:5.10, image:'/images/drink5.jpg' },
    { id:6, name:'Honeydew Milk Tea with Boba', price:4.85, image:'/images/drink6.jpg' },
    { id:7, name:'Matcha Latte with Boba', price:5.50, image:'/images/drink7.jpg' },
    { id:8, name:'Brown Sugar Milk Tea with Boba', price:5.75, image:'/images/drink8.jpg' },
    { id:9, name:'Strawberry Fruit Tea with Boba', price:4.60, image:'/images/placeholder.png' },
    { id:10, name:'Mango Fruit Tea with Boba', price:4.70, image:'/images/drink10.jpg' },
    { id:11, name:'Lychee Fruit Tea with Boba', price:4.95, image:'/images/drink11.jpg' },
    { id:12, name:'Passionfruit Green Tea with Boba', price:4.90, image:'/images/placeholder.png' },
    { id:13, name:'Peach Oolong Tea with Boba', price:5.00, image:'/images/drink13.jpg' },
    { id:14, name:'Coconut Milk Tea with Boba', price:5.15, image:'/images/drink14.jpg' },
    { id:15, name:'Almond Milk Tea with Boba', price:5.20, image:'/images/placeholder.png' },
    { id:16, name:'Coffee Milk Tea with Boba', price:5.30, image:'/images/drink16.jpg' },
    { id:17, name:'Wintermelon Milk Tea with Boba', price:4.80, image:'/images/placeholder.png' },
    { id:18, name:'Avocado Smoothie with Boba', price:6.25, image:'/images/placeholder.png' },
    { id:19, name:'Strawberry Banana Smoothie w/ Boba', price:6.50, image:'/images/drink19.jpg' },
    { id:20, name:'Mango Slush with Boba', price:6.00, image:'/images/drink20.jpg' }
];


export default function ManagerDashboard() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/menu" element={<div>Menu Page (stub)</div>} />
          <Route path="/employees" element={<div>Employee Page (stub)</div>} />
          <Route path="/inventory" element={<div>Inventory Page (stub)</div>} />
          <Route path="/orders" element={<div>Order Page (stub)</div>} />
          <Route path="/sales-trends" element={<div>Sales Trends Page (stub)</div>} />
          <Route path="/restock" element={<div>Restock (stub)</div>} />
          <Route path="/product-usage" element={<div>Product Usage Page (stub)</div>} />
          <Route path="/sales-report" element={<div>Sales Report Page (stub)</div>} />
          <Route path="/x-report" element={<div>X-Report Page (stub)</div>} />
          <Route path="/z-report" element={<div>Z-Report Page (stub)</div>} />
        </Routes>

        <Table headers={HEADERS} data={MENU}/>
      </BrowserRouter>

    </div>
  );
}

// Simple script for future navigation & interactivity
console.log("Welcome to LocalGo Delivery System!");

// Highlight active nav link
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".navbar nav a").forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});
// ✅ Save selected vendor and go to order page
function selectVendor(name, phone) {
  localStorage.setItem("selectedVendor", JSON.stringify({ name, phone }));
  alert(`${name} selected as your delivery vendor.`);
  window.location.href = "order.html"; // redirect to order form
}
// ✅ Display selected vendor on order page
document.addEventListener("DOMContentLoaded", function () {
  const vendorData = localStorage.getItem("selectedVendor");
  if (vendorData) {
    const { name } = JSON.parse(vendorData);
    document.getElementById("vendorName").textContent = name;
  } else {
    document.getElementById("vendorName").textContent = "No vendor selected";
  }
});

// ✅ Send order details via WhatsApp
// ✅ Send order details via WhatsApp and Save Locally
document.getElementById("orderForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const vendorData = JSON.parse(localStorage.getItem("selectedVendor"));
  if (!vendorData) {
    alert("Please select a vendor first!");
    window.location.href = "vendors.html";
    return;
  }

  // Get customer info
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const pickup = document.getElementById("pickupAddress").value.trim();
  const delivery = document.getElementById("deliveryAddress").value.trim();
  const item = document.getElementById("itemDescription").value.trim();

  // Generate random order ID
  const orderId = "ORD" + Math.floor(Math.random() * 1000000);

  // Create order object
  const newOrder = {
    id: orderId,
    vendor: vendorData.name,
    vendorPhone: vendorData.phone,
    customerName: name,
    customerPhone: phone,
    pickup: pickup,
    delivery: delivery,
    item: item,
    status: "Pending",
    createdAt: new Date().toLocaleString(),
  };

  // Save order to localStorage
  const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
  existingOrders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(existingOrders));

  // Prepare WhatsApp message
  const message = `🚚 *New Delivery Request*%0A
*Order ID:* ${orderId}%0A
*Customer:* ${name}%0A
*Phone:* ${phone}%0A
*Pickup:* ${pickup}%0A
*Delivery:* ${delivery}%0A
*Item:* ${item}%0A
*Status:* Pending%0A
%0AFrom LocalGo platform.`;

  const whatsappUrl = `https://wa.me/${vendorData.phone}?text=${message}`;
  window.open(whatsappUrl, "_blank");

  // Confirmation
  alert(`✅ Order placed successfully! Your Order ID is: ${orderId}`);
  document.getElementById("orderForm").reset();
});

// ✅ Order Tracking Logic (Mocked)
document.getElementById("trackForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const input = document.getElementById("trackInput").value.trim();
  const trackResult = document.getElementById("trackResult");

  // Retrieve stored orders
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const foundOrder = orders.find(
    (o) => o.customerPhone === input || o.id === input
  );

  if (foundOrder) {
    trackResult.style.display = "block";
    trackResult.innerHTML = `
      <p><strong>Customer:</strong> ${foundOrder.customerName}</p>
      <p><strong>Pickup:</strong> ${foundOrder.pickup}</p>
      <p><strong>Delivery:</strong> ${foundOrder.delivery}</p>
      <p><strong>Status:</strong> <span class="status ${foundOrder.status.toLowerCase()}">${foundOrder.status}</span></p>
    `;
  } else {
    trackResult.style.display = "block";
    trackResult.innerHTML = `<p style="color:red;">No order found for that phone number or ID.</p>`;
  }
});
// ✅ Display Saved Orders in My Orders Page
document.addEventListener("DOMContentLoaded", function () {
  const ordersContainer = document.getElementById("ordersContainer");
  if (!ordersContainer) return;

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    ordersContainer.innerHTML = `
      <p style="text-align:center; color:#777;">No orders found yet. <a href="order.html" style="color:#ffcc00; font-weight:600;">Book one now!</a></p>
    `;
    return;
  }

  ordersContainer.innerHTML = orders
    .map(
      (order) => `
      <div class="order-card">
        <h3>Order ID: ${order.id}</h3>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Vendor:</strong> ${order.vendor}</p>
        <p><strong>Pickup:</strong> ${order.pickup}</p>
        <p><strong>Delivery:</strong> ${order.delivery}</p>
        <p><strong>Item:</strong> ${order.item}</p>
        <p><strong>Date:</strong> ${order.createdAt}</p>
        <span class="status-tag status-${order.status.toLowerCase()}">${order.status}</span>
      </div>
    `
    )
    .join("");
});
// 🌗 Dark Mode Toggle
const themeToggle = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  let theme = "light";
  if (document.body.classList.contains("dark-mode")) {
    theme = "dark";
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }

  localStorage.setItem("theme", theme);
});
// 📜 Display Order History
const ordersList = document.getElementById("ordersList");

if (ordersList) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    ordersList.innerHTML = `<p>No orders yet. Place an order to see it here!</p>`;
  } else {
    ordersList.innerHTML = orders
      .map((order, index) => {
        return `
          <div class="order-card">
            <h3>Order #${index + 1}</h3>
            <p><strong>Vendor:</strong> ${order.vendor}</p>
            <p><strong>Name:</strong> ${order.name}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Details:</strong> ${order.details}</p>
            <p><strong>Time:</strong> ${order.time}</p>
            <p class="order-status">Status: Pending</p>
          </div>
        `;
      })
      .join("");
  }
}

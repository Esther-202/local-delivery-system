let currentOrder = null;
let refreshInterval = null;

// Function to render order details
function renderOrder(order) {
  const trackResult = document.getElementById("trackResult");
  if (!order) {
    trackResult.innerHTML = `<p>No order found with that ID.</p>`;
    return;
  }

  // Choose icon and color based on status
  let icon = "";
  let color = "";

  switch (order.status.toLowerCase()) {
    case "pending":
      icon = "🕓";
      color = "#ff9500";
      break;
    case "ontheway":
      icon = "🚗";
      color = "#007bff";
      break;
    case "delivered":
      icon = "✅";
      color = "#28a745";
      break;
    default:
      icon = "📦";
      color = "#555";
  }

  trackResult.innerHTML = `
    <div class="track-card status-${order.status.toLowerCase()}">
      <h3>Order ID: ${order.id}</h3>
      <p><strong>Vendor:</strong> ${order.vendorName}</p>
      <p><strong>Customer:</strong> ${order.customerName}</p>
      <p><strong>Pickup:</strong> ${order.pickup || "—"}</p>
      <p><strong>Delivery:</strong> ${order.address}</p>
      <p><strong>Item:</strong> ${order.details}</p>

      <div class="status-display" style="border-color: ${color}">
        <span class="status-icon" style="color:${color}">${icon}</span>
        <span class="status-text" style="color:${color}">${order.status}</span>
      </div>
    </div>
  `;
}



// Function to find and track order
function trackOrder() {
  const trackId = document.getElementById("trackId").value.trim();
  const orders = JSON.parse(localStorage.getItem("localgoOrders")) || [];

  if (orders.length === 0) {
    renderOrder(null);
    return;
  }

  // Find order by ID or use most recent
  if (trackId === "") {
    currentOrder = orders[orders.length - 1];
  } else {
    currentOrder = orders.find(o => o.id && o.id.toString() === trackId);
  }

  renderOrder(currentOrder);

  // Start live updates
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(() => refreshOrder(), 5000); // every 5s
}

// Refresh order status live
function refreshOrder() {
  if (!currentOrder) return;

  const orders = JSON.parse(localStorage.getItem("localgoOrders")) || [];
  const updatedOrder = orders.find(o => o.id === currentOrder.id);

  if (updatedOrder && updatedOrder.status !== currentOrder.status) {
    currentOrder = updatedOrder;
    renderOrder(currentOrder);
  }
}

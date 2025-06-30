// Initialize app data
document.addEventListener("DOMContentLoaded", () => {
  // Set default balance if not set
  if (!localStorage.getItem("balance")) {
    localStorage.setItem("balance", "1002357.46");
  }

  if (!localStorage.getItem("transactions")) {
    localStorage.setItem("transactions", JSON.stringify([]));
  }

  updateBalanceDisplay();
  showTransactions();
});

// Update displayed balance
function updateBalanceDisplay() {
  const balance = parseFloat(localStorage.getItem("balance") || "0");
  const display = document.getElementById("balance-display") || document.getElementById("account-balance");
  if (display) {
    display.textContent = `₦${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
  }
}

// Move to next PIN input
function moveToNext(current, nextId) {
  if (current.value.length === 1 && nextId) {
    document.getElementById(nextId).focus();
  }
}

// Show PIN modal
function handleTransfer() {
  const form = document.getElementById("transferForm");
  if (form.checkValidity()) {
    document.getElementById("pinModal").style.display = "block";
  } else {
    alert("Please fill all fields correctly.");
  }
}

// Cancel PIN input
function cancelTransfer() {
  document.getElementById("pinModal").style.display = "none";
  document.querySelectorAll(".pin-input").forEach(input => input.value = "");
}

// Complete the transfer after PIN validation
function completeTransfer() {
  const pin = [...document.querySelectorAll(".pin-input")].map(input => input.value).join("");

  if (pin.length !== 4 || isNaN(pin)) {
    alert("Enter a valid 4-digit PIN");
    return;
  }

  const acctName = document.getElementById("acctname").value;
  const acctNum = document.getElementById("acctnum").value;
  const bank = document.getElementById("bankname").value;
  const amount = parseFloat(document.getElementById("amount").value.replace(/[₦:,]/g, ""));
  const desc = document.getElementById("desc").value || "Transfer";

  let balance = parseFloat(localStorage.getItem("balance"));

  if (amount > balance) {
    alert("Insufficient balance.");
    return;
  }

  // Deduct and update balance
  balance -= amount;
  localStorage.setItem("balance", balance.toFixed(2));

  // Add transaction
  const transaction = {
    description: `${desc} - ${acctName} (${bank})`,
    amount: -amount,
    date: new Date().toLocaleString()
  };

  let transactions = JSON.parse(localStorage.getItem("transactions"));
  transactions.unshift(transaction); // Add to top
  localStorage.setItem("transactions", JSON.stringify(transactions));

  cancelTransfer(); // Close modal
  updateBalanceDisplay();
  alert("Transfer successful!");

  // If on dashboard, update transactions
  showTransactions();

  // Optional: Reset form
  document.getElementById("transferForm").reset();
}

// Show transactions in dashboard
function showTransactions() {
  const container = document.getElementById("transactions-container");
  if (!container) return;

  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

  container.innerHTML = ""; // Clear existing

  transactions.forEach(tx => {
    const item = document.createElement("div");
    item.className = "transaction-item";

    const descSpan = document.createElement("span");
    descSpan.className = "transaction-description";
    descSpan.textContent = tx.description;

    const amountSpan = document.createElement("span");
    amountSpan.className = "transaction-amount";
    if (tx.amount < 0) {
      amountSpan.classList.add("negative");
    }
    amountSpan.textContent = `${tx.amount < 0 ? "- " : "+ "}₦${Math.abs(tx.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}`;

    item.appendChild(descSpan);
    item.appendChild(amountSpan);
    container.appendChild(item);
  });
}

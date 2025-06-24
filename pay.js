
  let currentBalance = 1002357.46; 
  const correctPassword = "123456"; 

  function formatCurrency(amount) {
    return `₦${amount.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
  }

  function handleTransfer() {
    const acctNum = document.getElementById("acctnum").value.trim();
    const acctName = document.getElementById("acctname").value.trim();
    const bankName = document.getElementById("bankname").value;
    const amountInput = document.getElementById("amount").value.replace(/[^\d.]/g, '');
    const description = document.getElementById("desc").value.trim();

    const amount = parseFloat(amountInput);

    // Validate inputs
    if (!acctNum || !acctName || !bankName || isNaN(amount) || amount <= 0) {
      alert("Please fill out all fields correctly.");
      return;
    }

    const password = prompt("Enter your password to confirm transaction:");

    if (password === correctPassword) {
      if (amount > currentBalance) {
        alert("❌ Insufficient funds.");
        return;
      }

      currentBalance -= amount;

      // Update the balance display
      const balanceEl = document.querySelector(".transfer-header h2");
      balanceEl.textContent = formatCurrency(currentBalance);

      alert(`✅ Transfer of ₦${amount.toLocaleString()} to ${acctName} was successful.`);
      
      // Optionally clear form
      document.querySelector(".form-input-transfer").reset();
    } else {
      alert("❌ Incorrect password. Transaction canceled.");
    }
  }

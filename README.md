<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hotel Rating App</title>
  <style>
    body { font-family: Arial; background:#f0f0f0; margin:0; padding:0; }
    header { background:#0077cc; color:white; padding:20px; text-align:center; }
    section {
      margin:20px auto;
      padding:20px;
      max-width:600px;
      background:white;
      border-radius:10px;
      box-shadow:0 0 10px rgba(0,0,0,0.2);
      display: none;
    }
    section.active { display: block; }
    button {
      background:#28a745;
      color:white;
      border:none;
      padding:10px 15px;
      margin:5px 0;
      border-radius:5px;
      cursor:pointer;
    }
    input[type="email"] {
      padding:8px;
      width:calc(100% - 100px);
      margin-right:10px;
      border-radius:5px;
      border:1px solid #ccc;
    }
    .error { color:red; }
    nav {
      text-align:center;
      background:white;
      padding:10px;
      box-shadow:0 2px 5px rgba(0,0,0,0.1);
    }
    nav a {
      color:#0077cc;
      text-decoration:none;
      margin:0 10px;
      font-weight:bold;
    }
    nav a:hover { text-decoration:underline; }
  </style>
</head>
<body>

<header>
  <h1>💥 Hotel Rating App 💥</h1>
</header>

<nav>
  <a href="#" onclick="showSection('hotel-rating')">🏨 Hotels</a> |
  <a href="#" onclick="showSection('customer-service')">📞 Support</a> |
  <a href="#" onclick="showSection('withdrawals')">💰 Withdrawals</a>
</nav>

<!-- ====== SECTION 1: HOTEL RATING ====== -->
<section id="hotel-rating" class="active">
  <h2>🏨 Rate Hotels & Earn!</h2>
  <p>Search for hotels and rate them 5 stars to earn commission.</p>
  <button id="searchHotelBtn">🔍 Search Hotel</button>
  <button id="rateHotelBtn">⭐ Rate 5 Stars</button>
  <p id="commissionEarned">Commission Earned: £0.00</p>
</section>

<!-- ====== SECTION 2: CUSTOMER SERVICE ====== -->
<section id="customer-service">
  <h2>📞 Customer Service & Finance</h2>
  <p>Ask questions about deposits, withdrawals, or reset your work account.</p>
  <button id="askQuestionBtn">💬 Ask a Question</button>
  <button id="resetAccountBtn">🔄 Reset Account</button>
</section>

<!-- ====== SECTION 3: WITHDRAWALS ====== -->
<section id="withdrawals">
  <h2>💰 Withdrawals</h2>
  <p>Frozen Balance: £0.00</p>
  <p class="error" id="withdrawError"></p>
  <input type="email" id="paypalEmail" placeholder="Enter PayPal Email">
  <button id="withdrawBtn">💸 Withdraw</button>
</section>

<!-- ====== SCRIPT ====== -->
<script>
  // ===== Page Navigation =====
  function showSection(sectionId) {
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
  }

  // ===== Section 1 =====
  const hotels = ["Grand Plaza", "Sunny Resort", "Cozy Inn", "Skyline Hotel", "Ocean View"];
  let commission = 0;
  const searchHotelBtn = document.getElementById("searchHotelBtn");
  const rateHotelBtn = document.getElementById("rateHotelBtn");
  const commissionEarned = document.getElementById("commissionEarned");
  let currentHotel = "";

  searchHotelBtn.addEventListener("click", () => {
    currentHotel = hotels[Math.floor(Math.random() * hotels.length)];
    alert(`🏨 Found hotel: ${currentHotel}`);
  });

  rateHotelBtn.addEventListener("click", () => {
    if (!currentHotel) {
      alert("⚠️ Search a hotel first!");
      return;
    }
    commission += 5;
    commissionEarned.textContent = `Commission Earned: £${commission}.00`;
    alert(`⭐ You rated ${currentHotel} 5 stars! +£5 commission`);
    currentHotel = "";
  });

  // ===== Section 2 =====
  const askQuestionBtn = document.getElementById("askQuestionBtn");
  const resetAccountBtn = document.getElementById("resetAccountBtn");

  askQuestionBtn.addEventListener("click", () => {
    const question = prompt("💬 Enter your question about deposits, withdrawals, or account reset:");
    if (question) alert("✅ Your question has been submitted!");
  });

  resetAccountBtn.addEventListener("click", () => {
    if (confirm("⚠️ Are you sure you want to reset your account? This will clear all progress.")) {
      commission = 0;
      commissionEarned.textContent = `Commission Earned: £0.00`;
      alert("🔄 Your account has been reset!");
    }
  });

  // ===== Section 3 =====
  const withdrawBtn = document.getElementById("withdrawBtn");
  const paypalEmail = document.getElementById("paypalEmail");
  const withdrawError = document.getElementById("withdrawError");

  withdrawBtn.addEventListener("click", () => {
    if (commission === 0) {
      withdrawError.textContent = "⚠️ No funds to withdraw!";
      return;
    }
    if (!paypalEmail.value) {
      withdrawError.textContent = "⚠️ Enter a valid PayPal email!";
      return;
    }
    alert(`💸 £${commission}.00 has been sent to ${paypalEmail.value}!`);
    commission = 0;
    commissionEarned.textContent = `Commission Earned: £0.00`;
    withdrawError.textContent = "";
    paypalEmail.value = "";
  });
</script>

</body>
</html>

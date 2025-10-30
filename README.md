<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hotel Commission App</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f4f4;
      margin: 0;
      padding: 0;
      text-align: center;
    }
    header {
      background: #0078d7;
      color: white;
      padding: 15px 0;
    }
    nav {
      background: #222;
      padding: 10px;
    }
    nav a {
      color: white;
      margin: 0 10px;
      text-decoration: none;
      font-weight: bold;
    }
    nav a:hover {
      text-decoration: underline;
    }
    section {
      padding: 20px;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      background: #0078d7;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }
    .btn:hover {
      background: #005bb5;
    }
    input {
      padding: 10px;
      width: 250px;
      margin: 5px 0;
    }
  </style>
</head>
<body>

  <header>
    <h1>Hotel Commission App</h1>
  </header>

  <nav>
    <a href="#main">Hotel Ratings</a>
    <a href="#support">Customer & Finance</a>
    <a href="#withdrawal">Withdrawal Area</a>
  </nav>

  <section id="main">
    <h2>Section 1: Hotel Rating Tasks</h2>
    <p>Search and rate random hotels to earn commissions.</p>
    <input type="text" id="hotelSearch" placeholder="Search hotel ads..."><br>
    <button class="btn" onclick="rateHotel()">Rate 5 Stars</button>
    <p id="ratingStatus"></p>
  </section>

  <section id="support">
    <h2>Section 2: Customer & Finance Department</h2>
    <p>Ask about deposits, withdrawals, or reset your work account once all 33 tasks are complete.</p>
    <button class="btn" onclick="resetAccount()">Reset Work Account</button>
    <p id="resetStatus"></p>
  </section>

  <section id="withdrawal">
    <h2>Section 3: Withdrawal Area</h2>
    <p>Frozen balance: £0.00</p>
    <p>If an error occurred, your balance may display as £0.00.</p>
    <input type="email" id="paypalEmail" placeholder="Enter PayPal Email"><br>
    <button class="btn" onclick="withdrawFunds()">Withdraw</button>
    <p id="withdrawStatus"></p>
  </section>

  <script>
    function rateHotel() {
      const hotel = document.getElementById('hotelSearch').value;
      if (hotel.trim() === '') {
        document.getElementById('ratingStatus').textContent = 'Please enter a hotel name before rating.';
      } else {
        document.getElementById('ratingStatus').textContent = 'You rated ' + hotel + ' 5 stars. Commission earned.';
      }
    }

    function resetAccount() {
      document.getElementById('resetStatus').textContent = 'Your account has been reset for a new set of 33 tasks.';
    }

    function withdrawFunds() {
      const email = document.getElementById('paypalEmail').value;
      if (email.trim() === '') {
        document.getElementById('withdrawStatus').textContent = 'Please enter your PayPal email.';
      } else {
        document.getElementById('withdrawStatus').textContent = 'Withdrawal request sent to ' + email + '.';
      }
    }
  </script>

</body>
</html>

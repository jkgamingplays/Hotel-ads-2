# Hotel-ads-2
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Rating App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
        }
        header {
            background-color: #0077cc;
            color: white;
            padding: 20px;
            text-align: center;
        }
        section {
            margin: 20px auto;
            padding: 20px;
            max-width: 600px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
        button {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px 15px;
            margin: 5px 0;
            border-radius: 5px;
            cursor: pointer;
        }
        input[type="email"] {
            padding: 8px;
            width: calc(100% - 100px);
            margin-right: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
        .error {
            color: red;
        }
    </style>
</head>
<body>

    <header>
        <h1>💥 Hotel Rating App 💥</h1>
    </header>

    <!-- Section 1: Hotel Ratings -->
    <section id="hotel-rating">
        <h2>🏨 Rate Hotels & Earn!</h2>
        <p>Search for hotels and rate them 5 stars to earn commission.</p>
        <button id="searchHotelBtn">🔍 Search Hotel</button>
        <button id="rateHotelBtn">⭐ Rate 5 Stars</button>
        <p id="commissionEarned">Commission Earned: £0.00</p>
    </section>

    <!-- Section 2: Customer Service & Finance -->
    <section id="customer-service">
        <h2>📞 Customer Service & Finance</h2>
        <p>Ask questions about deposits, withdrawals, or reset your work account.</p>
        <button id="askQuestionBtn">💬 Ask a Question</button>
        <button id="resetAccountBtn">🔄 Reset Account</button>
    </section>

    <!-- Section 3: Withdrawals -->
    <section id="withdrawals">
        <h2>💰 Withdrawals</h2>
        <p>Frozen Balance: £0.00</p>
        <p class="error" id="withdrawError"></p>
        <input type="email" id="paypalEmail" placeholder="Enter PayPal Email">
        <button id="withdrawBtn">💸 Withdraw</button>
    </section>

</body>
</html>

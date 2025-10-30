<script>
    // ===== Section 1: Hotel Search & Rating =====
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
        commission += 5; // each 5-star rating gives £5
        commissionEarned.textContent = `Commission Earned: £${commission}.00`;
        alert(`⭐ You rated ${currentHotel} 5 stars! +£5 commission`);
        currentHotel = ""; // reset hotel for next search
    });

    // ===== Section 2: Customer Service & Reset =====
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

    // ===== Section 3: Withdrawals =====
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

        // Simulate successful withdrawal
        alert(`💸 £${commission}.00 has been sent to ${paypalEmail.value}!`);
        commission = 0;
        commissionEarned.textContent = `Commission Earned: £0.00`;
        withdrawError.textContent = "";
        paypalEmail.value = "";
    });
</script>

const $ = (id) => document.getElementById(id);

const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(n);

/* ---------------- EMI CALCULATOR ---------------- */

function calculateEMI() {
  const principal = Number($("emiPrincipal").value);
  const annualRate = Number($("emiRate").value);
  const years = Number($("emiYears").value);

  if (!principal || !annualRate || !years) {
    $("emiValue").textContent = "—";
    $("interestValue").textContent = "—";
    $("paymentValue").textContent = "—";
    return;
  }

  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;

  const emi =
    monthlyRate === 0
      ? principal / months
      : (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  $("emiValue").textContent = money(emi);
  $("interestValue").textContent = money(totalInterest);
  $("paymentValue").textContent = money(totalPayment);
}

$("calculateEmi").addEventListener("click", calculateEMI);


/* ---------------- LOAN ELIGIBILITY ---------------- */

$("loanForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const income = Number($("income").value);
  const existingEmi = Number($("existingEmi").value);
  const age = Number($("age").value);
  const creditScore = Number($("creditScore").value);
  const employment = $("employment").value;
  const loanAmount = Number($("loanAmount").value);

  const result = $("eligibilityResult");

  if (
    !income ||
    age < 18 ||
    !creditScore ||
    !loanAmount
  ) {
    result.className = "result bad";
    result.innerHTML =
      "<strong>Please complete all required fields.</strong><br>" +
      "Enter income, existing EMI, age, credit score and requested loan amount.";
    result.classList.remove("hidden");
    return;
  }

  if (
    income <= 0 ||
    existingEmi < 0 ||
    age < 18 ||
    age > 75 ||
    creditScore < 300 ||
    creditScore > 900 ||
    loanAmount <= 0
  ) {
    result.className = "result bad";
    result.innerHTML =
      "<strong>Invalid information.</strong><br>" +
      "Please check the values you entered.";
    result.classList.remove("hidden");
    return;
  }

  const debtRatio = ((existingEmi / income) * 100);

  let eligible = true;
  const reasons = [];

  if (age < 21 || age > 65) {
    eligible = false;
    reasons.push("Age should normally be between 21 and 65.");
  }

  if (creditScore < 650) {
    eligible = false;
    reasons.push("Credit score is below the preferred range.");
  }

  if (debtRatio > 50) {
    eligible = false;
    reasons.push("Existing EMI obligations are high relative to income.");
  }

  if (eligible) {
    const affordableEmi =
      Math.max(0, income * 0.45 - existingEmi);

    result.className = "result";
    result.innerHTML =
      "<strong>Likely Eligible ✓</strong><br>" +
      `Employment: ${employment}<br>` +
      `Debt-to-income ratio: ${debtRatio.toFixed(1)}%<br>` +
      `Estimated comfortable new EMI: ${money(affordableEmi)}<br>` +
      "<small>Final approval depends on the lender's policies and verification.</small>";
  } else {
    result.className = "result bad";
    result.innerHTML =
      "<strong>Needs Improvement</strong><br>" +
      reasons.join("<br>") +
      "<br><small>Improve the relevant factors before applying.</small>";
  }

  result.classList.remove("hidden");

  updateCreditScore(creditScore);

  $("emiPrincipal").value = loanAmount;
  calculateEMI();
});


/* ---------------- CREDIT SCORE ---------------- */

function updateCreditScore(score) {
  $("scoreValue").textContent = score;

  const percentage =
    Math.max(0, Math.min(100, ((score - 300) / 600) * 100));

  $("scoreMeter").style.width = percentage + "%";

  let label;

  if (score >= 800) {
    label = "Excellent credit profile";
  } else if (score >= 750) {
    label = "Very good credit profile";
  } else if (score >= 700) {
    label = "Good credit profile";
  } else if (score >= 650) {
    label = "Fair credit profile";
  } else {
    label = "Needs improvement";
  }

  $("scoreLabel").textContent = label;

  const insights = $("creditInsights");

  if (score >= 750) {
    insights.innerHTML = `
      <li>Your credit score is in a strong range.</li>
      <li>Continue making repayments on time.</li>
      <li>Avoid unnecessary credit applications.</li>
    `;
  } else if (score >= 650) {
    insights.innerHTML = `
      <li>Your score is acceptable but can be improved.</li>
      <li>Keep credit utilization below 30% where possible.</li>
      <li>Maintain a consistent repayment history.</li>
    `;
  } else {
    insights.innerHTML = `
      <li>Focus on timely repayment of existing debt.</li>
      <li>Reduce outstanding credit utilization.</li>
      <li>Avoid taking multiple new loans or credit cards.</li>
    `;
  }
}


/* ---------------- LOCAL FINANCIAL TIPS ---------------- */

$("generateTips").addEventListener("click", () => {
  const income = Number($("income").value);
  const existingEmi = Number($("existingEmi").value);
  const age = Number($("age").value);
  const creditScore = Number($("creditScore").value);

  if (!income || !age || !creditScore) {
    $("tipsOutput").innerHTML = `
      <p><strong>Please complete your financial profile first.</strong></p>
      <p>Enter your income, EMI, age and credit score to receive personalized guidance.</p>
    `;
    return;
  }

  const debtRatio = (existingEmi / income) * 100;

  const tips = [];

  if (creditScore < 700) {
    tips.push("Work on improving your credit score before taking a large new loan.");
  } else {
    tips.push("Your credit score is a good starting point for responsible borrowing.");
  }

  if (debtRatio > 40) {
    tips.push("Your existing EMI burden is relatively high. Consider reducing debt before adding another EMI.");
  } else {
    tips.push("Your existing EMI burden appears manageable relative to your income.");
  }

  if (income > 0) {
    tips.push("Maintain an emergency fund before committing to a long-term loan.");
  }

  tips.push("Compare interest rates, processing fees and total repayment cost before choosing a lender.");

  $("tipsOutput").innerHTML = `
    <p><strong>Personalized Financial Guidance</strong></p>
    <ul>
      ${tips.map((tip) => `<li>${tip}</li>`).join("")}
    </ul>
    <small>This guidance is educational and does not guarantee loan approval.</small>
  `;
});


/* ---------------- SAVE SESSION ---------------- */

$("saveRecord").addEventListener("click", () => {
  const record = {
    savedAt: new Date().toISOString(),
    income: $("income").value,
    existingEmi: $("existingEmi").value,
    age: $("age").value,
    creditScore: $("creditScore").value,
    employment: $("employment").value,
    loanAmount: $("loanAmount").value,
    emi: $("emiValue").textContent
  };

  if (
    !record.income ||
    !record.age ||
    !record.creditScore ||
    !record.loanAmount
  ) {
    $("saveStatus").textContent =
      "Please complete the financial profile before saving.";
    return;
  }

  localStorage.setItem(
    "loanCheckerRecord",
    JSON.stringify(record)
  );

  $("saveStatus").textContent =
    "✓ Session saved securely in this browser.";
});


/* ---------------- RESET / INITIAL STATE ---------------- */

$("scoreValue").textContent = "—";
$("scoreLabel").textContent = "Enter your credit score";
$("scoreMeter").style.width = "0%";

$("emiValue").textContent = "—";
$("interestValue").textContent = "—";
$("paymentValue").textContent = "—";

/* ---------------- RESET FORM ---------------- */

$("resetForm").addEventListener("click", () => {
  $("loanForm").reset();

  $("eligibilityResult").classList.add("hidden");

  $("scoreValue").textContent = "—";
  $("scoreLabel").textContent = "Enter your credit score";
  $("scoreMeter").style.width = "0%";

  $("creditInsights").innerHTML = `
    <li>Enter your credit score to receive personalized insights.</li>
  `;

  $("emiPrincipal").value = "";
  $("emiRate").value = "";
  $("emiYears").value = "";

  $("emiValue").textContent = "—";
  $("interestValue").textContent = "—";
  $("paymentValue").textContent = "—";

  $("tipsOutput").innerHTML = `
    <p><strong>Your financial guidance will appear here.</strong></p>
    <p>Enter your financial details and select Generate AI Guidance.</p>
  `;

  $("saveStatus").textContent =
    "Records are stored locally in this browser.";
});

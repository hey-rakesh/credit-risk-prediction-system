
const form = document.getElementById("loan-form");
const submitBtn = document.getElementById("submit-btn");
const formError = document.getElementById("form-error");
const resultEmpty = document.getElementById("result-empty");
const resultContent = document.getElementById("result-content");
const resultLoading = document.getElementById("result-loading");
const resultError = document.getElementById("result-error");
const errorMessage = document.getElementById("error-message");
const retryBtn = document.getElementById("retry-btn");
const resetBtn = document.getElementById("reset-btn");

let lastPayload = null;

function showState(state) {
  resultEmpty.classList.toggle("hidden", state !== "empty");
  resultContent.classList.toggle("hidden", state !== "content");
  resultLoading.classList.toggle("hidden", state !== "loading");
  resultError.classList.toggle("hidden", state !== "error");
}

function buildPayload() {
  const values = Object.fromEntries(
    new FormData(form).entries()
  );

  for (const key of [
    "person_age",
    "person_emp_length",
    "cb_person_cred_hist_length"
  ]) {
    values[key] = Number(values[key]);
  }

  for (const key of [
    "person_income",
    "loan_amnt",
    "loan_int_rate",
    "loan_percent_income"
  ]) {
    values[key] = Number(values[key]);
  }

  return values;
}

function validatePayload(p) {
  if (p.person_age < 18 || p.person_age > 100)
    return "Age must be between 18 and 100.";

  if (p.person_income <= 0)
    return "Annual income must be greater than zero.";

  if (p.person_emp_length < 0 || p.person_emp_length > 60)
    return "Employment length must be between 0 and 60 years.";

  if (p.loan_amnt <= 0)
    return "Loan amount must be greater than zero.";

  if (p.loan_int_rate < 0 || p.loan_int_rate > 100)
    return "Interest rate must be between 0% and 100%.";

  if (p.loan_percent_income < 0 || p.loan_percent_income > 1)
    return "Loan / income ratio must be between 0 and 1.";

  if (p.cb_person_cred_hist_length < 0)
    return "Credit history length cannot be negative.";

  return "";
}

async function runPrediction(payload) {
  formError.textContent = "";
  showState("loading");

  submitBtn.disabled = true;
  submitBtn.querySelector(".button-label").textContent =
    "Analyzing…";

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        body.detail || `API returned HTTP ${response.status}.`
      );
    }

    const probability = Number(body.default_probability);

    const prediction = Number(body.default_prediction);
    const threshold = Number(body.threshold);

    if (
      !Number.isFinite(probability) ||
      !Number.isFinite(threshold) ||
      !Number.isFinite(prediction)
    ) {
      throw new Error(
        "Prediction fields are missing from the API response."
      );
    }

    renderResult(
      probability,
      prediction,
      threshold,
      body.result
    );

  } catch (error) {
    errorMessage.textContent =
      error.message || "Could not connect to the prediction API.";

    showState("error");

  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector(".button-label").textContent =
      "Analyze credit risk";
  }
}

function renderResult(
  probability,
  prediction,
  threshold,
  apiResult
) {
  const pct = Math.max(
    0,
    Math.min(100, probability * 100)
  );

  const thresholdPct = Math.max(
    0,
    Math.min(100, threshold * 100)
  );

  const high = prediction === 1;

  document.getElementById("probability-value").textContent =
    `${pct.toFixed(1)}%`;

  const chip = document.getElementById("risk-chip");

  chip.textContent = high ? "HIGHER RISK" : "LOWER RISK";
  chip.classList.toggle("high", high);

  const fill = document.getElementById("meter-fill");

  fill.style.width = "0%";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fill.style.width = `${pct}%`;
    });
  });

  document.getElementById("threshold-marker").style.left =
    `${thresholdPct}%`;

  document.getElementById("threshold-value").textContent =
    `${(threshold * 100).toFixed(1)}%`;

  const card = document.getElementById("decision-card");

  card.classList.toggle("high", high);

  document.getElementById("decision-icon").textContent =
    high ? "!" : "✓";

  document.getElementById("decision-title").textContent =
    apiResult || (high ? "High Risk" : "Low Risk");

  document.getElementById("decision-copy").textContent =
    high
      ? "The estimated probability meets or exceeds the model's configured threshold. Review the application carefully; this is not a final lending decision."
      : "The estimated probability is below the model's configured threshold. Consider the full application and other relevant information before making a decision.";

  showState("content");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  lastPayload = buildPayload();

  const error = validatePayload(lastPayload);

  if (error) {
    formError.textContent = error;
    return;
  }

  runPrediction(lastPayload);
});

resetBtn.addEventListener("click", () => {
  showState("empty");
  formError.textContent = "";
});

retryBtn.addEventListener("click", () => {
  if (lastPayload) {
    runPrediction(lastPayload);
  } else {
    showState("empty");
  }
});

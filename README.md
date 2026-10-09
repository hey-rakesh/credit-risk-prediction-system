# 💳 Credit Risk Prediction System

### Machine Learning | FastAPI | HTML | CSS | JavaScript

An end-to-end Machine Learning web application that predicts loan default risk using applicant financial details, loan information, and credit history. The system integrates a trained ML model with a FastAPI backend and an interactive web interface.

🔗 **Live Demo:** [Credit Risk Prediction System](https://credit-risk-prediction-system-q8iv.onrender.com/)

👨‍💻 **GitHub Profile:** [hey-rakesh](https://github.com/hey-rakesh/)

---

## ✨ Features

- 🤖 Machine Learning-based default risk prediction
- 📊 Default probability visualization
- 🎯 Threshold-based risk classification
- ⚡ FastAPI REST API integration
- 🎨 Modern dark-themed user interface
- 📱 Responsive frontend design
- ✨ Smooth animations and interactive components
- ✅ Input validation using Pydantic
- 📚 Interactive API documentation with Swagger UI
- ☁️ Deployment configuration for Render

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| Pandas | Input data preparation |
| Scikit-learn | Machine Learning |
| Joblib | Model serialization and loading |
| FastAPI | Backend API |
| Pydantic | Request validation |
| Uvicorn | ASGI server |
| HTML5 | Web structure |
| CSS3 | Styling and animations |
| JavaScript | Frontend interactions |
| Git & GitHub | Version control |
| Render | Cloud deployment |

---

## 🧠 How It Works

1. The user enters applicant information.
2. The frontend sends the data to the FastAPI backend.
3. Pydantic validates the request.
4. The application converts the input into a Pandas DataFrame.
5. The trained ML model estimates the probability of default.
6. The probability is compared with the saved decision threshold.
7. The application returns the predicted risk category.
8. The frontend displays the probability and classification.

### Risk Classification

- **High Risk:** Predicted default probability is greater than or equal to the configured threshold.
- **Low Risk:** Predicted default probability is below the configured threshold.

The classification threshold is loaded from `best_threshold.pkl`.

---

## 📋 Input Features

The model API accepts 11 applicant features:

| Feature | Description |
|---|---|
| `person_age` | Applicant's age |
| `person_income` | Annual income |
| `person_home_ownership` | Home ownership category |
| `person_emp_length` | Employment length |
| `loan_intent` | Purpose of the loan |
| `loan_grade` | Loan grade |
| `loan_amnt` | Requested loan amount |
| `loan_int_rate` | Loan interest rate |
| `loan_percent_income` | Loan amount-to-income ratio |
| `cb_person_default_on_file` | Historical default indicator |
| `cb_person_cred_hist_length` | Credit history length |

Categorical values and feature names must remain compatible with the model's training pipeline.

---

## 📁 Project Structure

```text
credit-risk-prediction-system/
│
├── main.py
├── requirements.txt
├── render.yaml
├── .python-version
├── README.md
│
├── notebook/
│   ├── credit_risk_model.pkl
│   └── best_threshold.pkl
│
└── static/
    ├── index.html
    ├── style.css
    └── script.js
```

### Important Files

- `main.py` — FastAPI application and prediction endpoint.
- `requirements.txt` — Python dependencies.
- `render.yaml` — Render deployment configuration.
- `credit_risk_model.pkl` — Trained ML model.
- `best_threshold.pkl` — Saved classification threshold.
- `index.html` — Frontend structure.
- `style.css` — UI styling and animations.
- `script.js` — API communication and result visualization.

---

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/credit-risk-prediction-system.git
cd credit-risk-prediction-system
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the application

```bash
python -m uvicorn main:app --reload
```

### 5. Open the application

| Resource | URL |
|---|---|
| Web App | http://127.0.0.1:8000 |
| API Documentation | http://127.0.0.1:8000/docs |
| Health Check | http://127.0.0.1:8000/health |

Ensure both model files are present in the configured `notebook/` directory.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Serves the web application |
| GET | `/health` | Checks application and model status |
| POST | `/predict` | Predicts default risk |
| GET | `/docs` | Opens Swagger API documentation |

### Prediction Response

The `/predict` endpoint returns:

- `default_probability` — Estimated default probability.
- `default_prediction` — Predicted class (`0` or `1`).
- `threshold` — Configured classification threshold.
- `result` — `High Risk` or `Low Risk`.

---

## ☁️ Deployment

This project is configured for deployment on [Render](https://render.com/).

**Build command**

```bash
pip install -r requirements.txt
```

**Start command**

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Before deployment, ensure that:

- Both model artifacts are accessible to the application.
- Required Python dependencies are installed.
- Scikit-learn versions are compatible with the saved model.
- Model input features match the training pipeline.

🌐 **Live Application:** [Open Credit Risk Prediction System](https://credit-risk-prediction-system-q8iv.onrender.com/)

---

## 📈 Model Evaluation

Evaluate the trained model on held-out test data using:

- **Precision** — Reliability of positive default predictions.
- **Recall** — Proportion of actual defaults detected.
- **F1-score** — Balance between precision and recall.
- **ROC-AUC** — Ability to rank positive and negative cases.
- **PR-AUC** — Precision-recall performance.
- **Confusion Matrix** — Breakdown of correct and incorrect predictions.

Model metrics should be added after verifying the final test-set results.

---

## 🔮 Future Improvements

- SHAP-based model explainability
- Automated model monitoring
- Improved logging and error handling
- API authentication and rate limiting
- Docker deployment
- Model drift detection
- Fairness and calibration analysis

---

## 👨‍💻 Author
**Rakesh** — Engineering Student | AI & Machine Learning



---

## ⚠️ Disclaimer

This project is intended for educational and demonstration purposes. Predictions are estimates, not guarantees of future defaults or recommendations to approve or reject a loan. Real lending decisions require additional validation, fairness assessment, security controls, and regulatory compliance.

---

⭐ If you find this project useful, consider starring the repository!

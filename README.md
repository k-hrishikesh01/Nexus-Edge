# 🎓 Nexus Edge AI - Enterprise Student Marks Prediction System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![React](https://img.shields.io/badge/React-Vite-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green?logo=fastapi)

Welcome to the **Enterprise Student Marks Prediction System**! 🚀 This is an advanced, full-stack web application designed to help educational institutions predict student performance, detect potential risks, and optimize study strategies. The platform leverages modern artificial intelligence concepts to predict marks based on historical academic data and individual study habits.

---

## ✨ Features

- **🔮 Predictive Analytics Engine**: Accurate predictions for upcoming subject marks utilizing target study hours and past performance history.
- **🛡️ Risk Assessment**: Categorizations into `Low Risk`, `Medium Risk`, and `High Risk` automatically for every subject analyzed.
- **📊 Interactive Visualizations**: Dynamic charts using Recharts that effortlessly compare previous performances, expected targets, and predicted marks.
- **💻 Glassmorphism UI**: A sleek, premium, dark-themed interface crafted meticulously to deliver a top-tier user experience.
- **⚡ Extremely Fast**: Powered by an asynchronous FastAPI backend and a lightning-fast React + Vite frontend.
- **🗄️ SQL Persistence**: Stores complete student profiles, their individual subject evaluations, and generated predictions securely.

---

## 🛠️ Technology Stack

We believe in using the absolute best modern technologies to provide top-notch performance.

### **Frontend (Client-Side)**
- **React 18** & **Vite**: Rapid development environment and component-based UI.
- **Tailwind CSS**: Utility-first CSS framework for beautiful rapid styling.
- **Recharts**: For smooth, declarative, and responsive data visualizations.
- **Lucide-React**: Clean, simple, and elegant SVG icons.
- **Axios**: Promised-based HTTP client for the browser.

### **Backend (Server-Side & Data)**
- **FastAPI**: Modern, fast web framework for building APIs with Python 3.
- **SQLAlchemy**: The Python SQL toolkit and Object Relational Mapper.
- **SQLite**: Lightweight, fast, disk-based database for development.
- **Pydantic**: Data validation and strict type enforcement.
- **Uvicorn**: Lightning-fast ASGI web server implementation.

---

## 🚀 Getting Started

Follow these precise instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18+)
- **Python** (v3.10+)
- **NPM** or **Yarn**

### 1. 📂 Clone the Repository
```bash
git clone https://github.com/<your-username>/Student-Marks-analyser.git
cd Student-Marks-analyser
```

### 2. 🐍 Backend Setup (FastAPI)
Navigate to the root directory, create a virtual environment, and install the required dependencies.

```bash
# Create the virtual environment
python3 -m venv venv

# Activate the virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install the Python dependencies
pip install -r backend/requirements.txt
```

### 3. ⚛️ Frontend Setup (React/Vite)
Open a new terminal session, navigate to the frontend directory, and install all npm packages.

```bash
cd frontend
npm install
```

---

## 💻 Running the Application

To ensure smooth operation, you must run both the Backend and Frontend servers simultaneously in two separate terminal windows.

### Starting the Backend Server
Make sure your virtual environment is activated, then run:

```bash
# In the root project directory:
uvicorn backend.main:app --reload --port 8000
```
> The API will be available at: `http://localhost:8000`
> You can visit the interactive auto-generated Swagger UI docs at: `http://localhost:8000/docs`

### Starting the Frontend Server
Navigate to the frontend folder and start the Vite development server:

```bash
cd frontend
npm run dev
```
> The web application will instantly become available at: `http://localhost:5173`

---

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! Let's build to inspire!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ and advanced engineering.*

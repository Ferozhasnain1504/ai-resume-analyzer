# 🧠 CVAI - AI Resume Analyzer

An **AI-powered Resume Analyzer** web application built using **Puter** that allows users to upload resumes and receive structured insights, feedback, and analysis using modern AI workflows.

This project leverages **Puter’s cloud-native platform** for file handling, execution, and AI-assisted processing — making it lightweight, scalable, and easy to deploy.

---

## ✨ Key Features

- 📄 Upload resumes (PDF / text-based)
- 🧠 Analyze resume content using AI
- 📌 Extract key sections:
  - Skills
  - Education
  - Experience
- 💡 Provide AI-generated feedback & insights
- ☁️ Cloud-based execution powered by **Puter**
- ⚡ Fast, modern frontend using Vite + React

---

## 🧩 What is Puter & Why It’s Used?

**Puter** is an open cloud platform that provides:
- Browser-based runtime
- File system APIs
- AI-friendly execution environment
- Easy hosting without traditional backend setup

### In this project, Puter is used for:
- 🗂 Resume file storage & access
- 🧠 Running AI logic without managing servers
- 🌐 Deploying the app directly in the browser cloud
- 🔐 Secure, sandboxed execution

This removes the need for:
❌ Traditional backend servers  
❌ Complex cloud configuration  
❌ Manual file handling  

---

## 🛠 Tech Stack

| Layer | Technology |
|------|-----------|
| Platform | **Puter** |
| Frontend | React + TypeScript |
| Build Tool | Vite |
| Routing | React Router |
| Styling | CSS / Tailwind (if used) |
| AI Logic | Puter AI APIs / Custom logic |
| File Handling | Puter File System |

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── app/ # Application source code
├── constants/ # Static values & prompts
├── public/ # Static assets
├── types/ # TypeScript types
├── react-router.config.ts # Routing configuration
├── vite.config.ts # Vite setup
├── Dockerfile # Optional container support
├── notes.md # Development notes
├── package.json # Scripts & dependencies
└── README.md # Documentation
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v16+)
- npm / yarn
- A **Puter account**

---

### 🔧 Installation

```bash
git clone https://github.com/Ferozhasnain1504/ai-resume-analyzer.git
cd ai-resume-analyzer
npm install
```

#### ▶️ Run Locally
```bash
npm run dev
```
Then open:
```
http://localhost:5173
```

### ☁️ Running on Puter
Open Puter

1. Upload or link this repository
2. Run the app directly inside Puter’s environment
3. Use Puter’s file system to upload r🙌 Acknowledgements

Puter for providing a powerful cloud runtime

Open-source AI & frontend toolsesumes
4. Let AI analyze resumes in real time
No backend deployment required 🚀

### 🧠 How the Resume Analyzer Works

1. User uploads resume via Puter file system
2. Text is extracted from the document
3. AI logic processes content
4. Insights & feedback are generated
5. Structured results displayed in UI

---

## 🤝 Contributing

Contributions are welcome!
* Fork the repo
* Create a feature branch
*   Submit a pull request

## 📄 License

Specify your license here (MIT recommended).

---

## 🙌 Acknowledgements

Puter for providing a powerful cloud runtime
Open-source AI & frontend tools

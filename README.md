# 📘 KidoQuiz

KidoQuiz is a fun, interactive quiz platform that uses **QR codes** to allow participants to join and play in real-time. It is built using **Next.js 15**, **Firebase** for database storage, and **TypeScript** for type safety.

---

## 🚀 Features

- 🔄 **Live QR Code Generation** – Users can scan a dynamic QR code to enter the quiz.
- ✅ **One-time QR Usage** – Each QR code can only be used once, for security.
- 🔁 **Automatic Refresh** – After scanning, a new QR code is generated and displayed.
- ☁️ **Deployed on Railway** – Production-ready and accessible online.
- 🔥 **Firebase Integration** – All scanned QR codes are securely stored in Firestore.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 15 (App Router)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **QR Generation**: `qrcode` package
- **UUIDs**: `uuid` package

---

## 🧑‍💻 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/kidoquiz.git
cd kidoquiz
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory and add:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-msg-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```
> ⚠️ Get this config from your Firebase Console > Project Settings.

### 4. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

---

## 🔒 QR Code Logic
- QR code is stored in-memory and displayed on screen
- On scan, the code is marked `isUsed: true`
- A new QR code is generated automatically
- The scanned QR's ID and timestamp are saved to Firebase

---

## 📦 Deployment
Project is deployed using [Railway](https://railway.app/).
To deploy:
```bash
npm run build
npm start
```

---

## 📂 Folder Structure
```
/app
  /components - All UI components (e.g. QRDisplay)
  /api/qr - QR code generation and validation logic
/lib
  firebase.ts - Firebase config and setup
/public
  placeholder.svg - Fallback QR image
```

---

## ✅ To-Do / Future Improvements
- 🎯 Add leaderboard and user tracking
- 🧑‍🏫 Admin panel for quiz creation and monitoring
- ⏱️ Expiry-based QR system (time-based logic)

---

## 🧠 Author
**Satish** – Built during internship with a focus on automation, Firebase, and modern Next.js app features.



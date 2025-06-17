# ⚡️ SwiftDrop

SwiftDrop is a sleek, minimalistic file transfer app that lets you send files between your **phone and computer** by scanning a QR code — no accounts, no cables, just instant sharing.

> Think AirDrop, but in your browser.  
> Works locally, designed for the internet.

---

## 📱 How it Works

1. Open SwiftDrop on your computer and **start a new session**.
2. A **unique session ID** is generated and shown as a **QR code**.
3. Scan the QR code with your **phone's camera**.
4. Both devices are redirected to the same **temporary sharing session**.
5. Drag and drop files to share them instantly between devices.

---

## 🌐 Key Features

- 📷 QR-based session pairing  
- 🔐 Secure, private, temporary sessions  
- 🌈 Mobile-first responsive design  
- 🚀 Blazing fast local file transfers  
- 🧠 Planned WebRTC / WebSocket support for internet sessions

---

## 🛠️ Tech Stack

| Frontend        | Backend (optional)     | Features                      |
|-----------------|------------------------|-------------------------------|
| React (Vite)    | Node.js + Express      | QR Code generation            |
| Tailwind CSS    | WebSocket or WebRTC    | Drag-and-drop file uploads    |
| qrcode.react    |                        | Peer-to-peer ready architecture |

---

## 🚧 Roadmap

- [x] Local QR-based session join  
- [x] File sharing UI  
- [ ] WebSocket-based session sync  
- [ ] P2P file transfer via WebRTC  
- [ ] Expiring sessions & secure access  
- [ ] Deploy to Vercel / Netlify  
- [ ] Dark theme with green accent  
- [ ] PWA support (installable app)  

---

## 📦 Installation

### ⚙️ Prerequisites

- Node.js v18+
- npm or yarn

### 🔄 Setup

```bash
git clone https://github.com/your-username/swiftdrop.git
cd swiftdrop

# Install frontend
npm install

# Start development server
npm run dev

#Restaurant Employee Scheduling App (Frontend)

## Overview
This project is a responsive web application designed to help restaurant managers create and manage weekly employee schedules. Employees can log in to view their assigned shifts, improving visibility and reducing missed workdays due to schedule confusion.
This tool modernizes the current paper-based system by providing real-time access to the schedule from any device. It was inspired by real operational challenges faced in a restaurant setting, including no-shows, employees arriving when not scheduled, and unclear shift communication. My goal is to eliminate schedule-related issues by improving access and accountability, reducing both missed shifts and unnecessary arrivals.

## 🔧 Tech Stack
- **Frontend:** React Native with Expo Router
- **Styling:** Tailwind CSS (via NativeWind)
- **Navigation:** Expo Router (file-based)
- **State Management:** React Context API
- **Backend API:** Node.js, Express, PostgreSQL (via REST API)
- **Auth:** Token-based authentication with secure storage

## ✨ Features
- 🔒 Secure employee login with role-based access (manager vs employee)
- 🗓️ Manager dashboard to create, assign, and view shifts by day
- 📆 Visual calendar-style layout for shift creation
- 👥 Assign roles (e.g., Server, Host, Busser) to shifts
- 📲 Employees can view their full two-week schedule
- 🔔 Notifications system for schedule updates
- 🕐 Weekly availability management (employees + managers)
- 🌐 Responsive and mobile-first design (for deployment to iOS/Android via Expo)

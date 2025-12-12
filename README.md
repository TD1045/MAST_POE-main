# **MAST5112 Portfolio of Evidence**
## **Mobile App Scripting - Chef Menu Managemen App**

---

### **👨‍🎓 Student Details**
- **Full Name:** Tendani Mulalo Matshaba
- **Student Number:** ST10379134
- **Email:** ST10379134@IMCONNECT.EDU.ZA
- **Module:** MAST5112/d/p/w
- **Submission Date:** 12 December 2025

#### **Radbull - Private Chef Menu Manager**
-***App Overview***
-Radbull is a React Native mobile application designed for private chefs to manage their menus. The app allows chefs to create, edit, and organize menu items by course, and provides a clean interface for guests to view filtered menu options.

-***Purpose***
-Based on the assignment requirements, this app serves as a digital menu system for private chef Christoffel. It provides a cross-platform solution (Android and iOS) that enables:

-Menu item management with dish name, description, course selection, and price
-Display of the complete menu on a home screen
-Course-based filtering for guest viewing
-Separation between menu management (adding/removing items) and menu presentation

-***Getting Started***
-_Follow these steps to run the app_:
-Clone the repository to your computer (run inside cmd: git clone https://github.com/TD1045/MAST_POE-main.git)
-Open a terminal and navigate to the project folder (run inside cmd: cd MAST_POE-main)
-Install required packages by running: npm install
-Start the app using one of these methods:

***To run on your phone:***
-Install the Expo Go app from your phone's app store
-In the terminal, run: npx expo start
-Scan the QR code with the Expo Go app

***To run in a web browser:***
-In the terminal, run: npx expo start --web
-Open your browser

***To run on an emulator:***
-Start your Android or iOS emulator
-In the terminal, run: npx expo start
-Press 'a' for Android or 'i' for iOS when prompted

***Project Structure***

MAST_POE-main/
├── App.tsx
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── AddItemScreen.tsx
│   │   └── FilterScreen.tsx
│   ├── components/
│   │   ├── MenuItem.tsx
│   │   └── CourseFilter.tsx
│   ├── utils/
│   │   └── calculations.ts
│   └── types/
│       └── MenuItem.ts
├── README.md
└── package.json

# Burger-King (Web App)


A **Burger King-themed web application** built using **Node.js, Express.js, EJS, and MongoDB**.
This project allows users to browse burgers, create an account, and place orders.
Admins can manage products, users, and orders using full **CRUD (Create, Read, Update, Delete)** functionality.

---

## 🚀 Features

### 👤 User Side

* View all available burgers with details and prices
* Create an account / login
* Edit user profile information
* Add burgers to the cart and place an order
* Responsive and dynamic UI built with **EJS templates**

### 🛠️ Admin Side

* Admin login system
* Add, update, or delete burger items
* Manage all user accounts
* View and handle orders placed by users
* Full **CRUD operations** for burgers and users

---

## 🧰 Technologies Used

| Category       | Technology                                                 |
| -------------- | ---------------------------------------------------------- |
| Frontend       | EJS (Embedded JavaScript Templates), HTML, CSS, JavaScript |
| Backend        | Node.js, Express.js                                        |
| Database       | MongoDB (Mongoose ORM)                                     |
| Authentication | Express-Session / JWT (based on implementation)            |
| Other Tools    | Nodemon, bcrypt (for password hashing)             |

---

## ⚙️ Installation & Setup

```bash

Follow these steps to run the project locally:

# 1. Clone the repository
git clone https://github.com/yourusername/burger-king-webapp.git

# 2. Navigate into the project folder
cd burger-king-webapp

# 3. Install dependencies
npm install

# 4. Create a .env file in the root directory and add:
PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key

# 5. Start the server
npm start
```

Your app will run on **[http://localhost:3000](http://localhost:3000)**

---

## 🗂️ Folder Structure

```
Burger-King-WebApp/
│
├── public/               # Static files (CSS, JS, Images)
├── views/                # EJS templates
│   ├── partials/         # Header, Footer, etc.
│   ├── user/             # User pages (home, menu, profile)
│   └── admin/            # Admin dashboard pages
│
├── routes/               # App routes (user, admin)
├── models/               # MongoDB schemas
├── controllers/          # Route logic
├── app.js                # Main entry point
└── package.json
```

---

## 🧩 Core Functionalities

* **Authentication System** – Secure login and registration
* **Dynamic EJS Rendering** – Data fetched from MongoDB displayed dynamically
* **Admin Dashboard** – Control all burgers and users
* **Order Management** – Users can place and view their orders
* **Profile System** – Each user can edit and manage their profile

---

## 📸 Screenshots (Optional)

*Add screenshots of your app here — e.g., homepage, admin panel, menu page.*

---

## 💡 Future Improvements

* Payment gateway integration (Stripe / PayPal)
* Order status tracking
* Email notifications for orders

---

## 🧑‍💻 Author

**Muhammad Zohaib Tariq**
* 💼 *Full Stack Developer (MERN / EJS Stack)*
* 📧 [zohaibtariq566@gmail.com]
* 🌐 [www.linkedin.com/in/zohaib-tariq-meo]


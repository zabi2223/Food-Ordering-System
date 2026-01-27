import express from "express";
import {
  homePage,
  productPage,
  aboutPage,
  addToCart,
  cartPage,
  deleteCartItem,
  checkoutPage,
  placeOrder,
  loginPage,
  signupPage,
  signupUser,
  loginUser,
  logoutUser,
  profilePage,
  changePassword
} from "../Controllers/userController.js";

import { isUserAuthenticated } from "../Middleware/userAuth.js";

const router = express.Router();

/* ==================== User ==================== */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: User Home Page
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Render user home page
 */
router.get('/', homePage);

/**
 * @swagger
 * /user/product:
 *   get:
 *     summary: Get all products
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Render product page with products
 */
router.get('/product', productPage);

/**
 * @swagger
 * /user/about:
 *   get:
 *     summary: About page
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Render about page
 */
router.get('/about', aboutPage);

/* ==================== Cart ==================== */

/**
 * @swagger
 * /user/product/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required: [name, price, quantity, productId]
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               productId:
 *                 type: string
 *     responses:
 *       302:
 *         description: Product added to cart
 */
router.post('/product/add', isUserAuthenticated, addToCart);

/**
 * @swagger
 * /user/cart:
 *   get:
 *     summary: View cart items
 *     tags: [Cart]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Render cart page
 */
router.get('/cart', isUserAuthenticated, cartPage);

/**
 * @swagger
 * /user/cart/delete/{id}:
 *   get:
 *     summary: Delete item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Cart item deleted
 */
router.get('/cart/delete/:id', deleteCartItem);

/* ==================== Checkout ==================== */

/**
 * @swagger
 * /user/checkout:
 *   get:
 *     summary: Checkout page
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Render checkout page
 */
router.get('/checkout', checkoutPage);

/* ==================== Place Order ==================== */

/**
 * @swagger
 * /user/place-order:
 *   post:
 *     summary: Place an order
 *     tags: [Order]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required: [name, mobile, address]
 *             properties:
 *               name:
 *                 type: string
 *               mobile:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       302:
 *         description: Order placed successfully
 */
router.post('/place-order', isUserAuthenticated, placeOrder);

/* ==================== Login / Signup / Logout ==================== */

/**
 * @swagger
 * /user/login:
 *   get:
 *     summary: Login page
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Render login page
 */
router.get('/login', loginPage);

/**
 * @swagger
 * /user/signup:
 *   get:
 *     summary: Signup page
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Render signup page
 */
router.get('/signup', signupPage);

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: User registered successfully
 */
router.post('/signup', signupUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Login successful
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       302:
 *         description: User logged out
 */
router.get('/logout', isUserAuthenticated, logoutUser);

/* ==================== User Profile ==================== */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: User profile page
 *     tags: [Profile]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Render profile page
 */
router.get('/profile', isUserAuthenticated, profilePage);

/* ==================== Change Password ==================== */

/**
 * @swagger
 * /user/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Profile]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required: [old_password, new_password]
 *             properties:
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Password updated successfully
 */
router.post('/change-password', isUserAuthenticated, changePassword);

export default router;

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

const router = express.Router();

function isUserAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/user/login');
}

/* ==================== User ==================== */
router.get('/', homePage);
router.get('/product', productPage);
router.get('/about', aboutPage);

/* ==================== Cart ==================== */
router.post('/product/add', isUserAuthenticated, addToCart);
router.get('/cart', isUserAuthenticated, cartPage);
router.get('/cart/delete/:id', deleteCartItem);

/* ==================== Checkout ==================== */
router.get('/checkout', checkoutPage);

/* ==================== Place Order ==================== */
router.post('/place-order', isUserAuthenticated, placeOrder);

/* ==================== Login / Signup / Logout ==================== */
router.get('/login', loginPage);
router.get('/signup', signupPage);
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/logout', isUserAuthenticated, logoutUser);

/* ==================== User Profile ==================== */
router.get('/profile', isUserAuthenticated, profilePage);

/* ==================== Change Password ==================== */
router.post('/change-password', isUserAuthenticated, changePassword);

export default router;

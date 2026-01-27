import express from "express";
import multer from "multer";
import {
  adminDashboard,
  adminLogout,

  productIndex,
  productAddPage,
  productAdd,
  productView,
  productDelete,
  productEditPage,
  productEdit,

  usersView,
  userStatusChange,

  orderIndex,
  orderApprove,
  orderReject
} from "../Controllers/adminController.js";

import { isAdminAuthenticated } from "../Middleware/adminAuth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ==================== Admin ==================== */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Admin dashboard
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin dashboard page
 */
router.get("/", isAdminAuthenticated, adminDashboard);

/**
 * @swagger
 * /admin/logout:
 *   get:
 *     summary: Logout admin
 *     tags: [Admin]
 *     responses:
 *       302:
 *         description: Redirects to login page after logout
 */
router.get("/logout", isAdminAuthenticated, adminLogout);

/* ==================== Manage Product ==================== */

/**
 * @swagger
 * /admin/product/index:
 *   get:
 *     summary: List all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Returns product listing page
 */
router.get("/product/index", isAdminAuthenticated, productIndex);

/**
 * @swagger
 * /admin/product/add:
 *   get:
 *     summary: Show add product page
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Returns add product form
 */
router.get("/product/add", isAdminAuthenticated, productAddPage);

/**
 * @swagger
 * /admin/product/add:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *       - in: formData
 *         name: price
 *         type: string
 *         required: true
 *       - in: formData
 *         name: description
 *         type: string
 *         required: true
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *     responses:
 *       302:
 *         description: Redirects after product added
 */
router.post(
  "/product/add",
  isAdminAuthenticated,
  upload.single("image"),
  productAdd
);

/**
 * @swagger
 * /admin/product/view:
 *   get:
 *     summary: View all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Returns product view page
 */
router.get("/product/view", isAdminAuthenticated, productView);

/**
 * @swagger
 * /admin/product/delete/{id}:
 *   get:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       302:
 *         description: Redirects after deletion
 */
router.get("/product/delete/:id", isAdminAuthenticated, productDelete);

/**
 * @swagger
 * /admin/product/edit/{id}:
 *   get:
 *     summary: Get product edit page
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Returns edit product form
 */
router.get("/product/edit/:id", isAdminAuthenticated, productEditPage);

/**
 * @swagger
 * /admin/product/edit/{id}:
 *   post:
 *     summary: Update a product
 *     tags: [Products]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *       - in: formData
 *         name: price
 *         type: string
 *         required: true
 *       - in: formData
 *         name: description
 *         type: string
 *         required: true
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *     responses:
 *       302:
 *         description: Redirects after product updated
 */
router.post(
  "/product/edit/:id",
  isAdminAuthenticated,
  upload.single("image"),
  productEdit
);

/* ==================== Manage Users ==================== */

/**
 * @swagger
 * /admin/users/view:
 *   get:
 *     summary: View all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Returns users listing page
 */
router.get("/users/view", isAdminAuthenticated, usersView);

/**
 * @swagger
 * /admin/user/status/{id}:
 *   get:
 *     summary: Toggle user status (Active/Block)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       302:
 *         description: Redirects after status change
 */
router.get("/user/status/:id", isAdminAuthenticated, userStatusChange);

/* ==================== Manage Orders ==================== */

/**
 * @swagger
 * /admin/order/index:
 *   get:
 *     summary: View all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Returns orders page
 */
router.get("/order/index", isAdminAuthenticated, orderIndex);

/**
 * @swagger
 * /admin/order/approve/{id}:
 *   get:
 *     summary: Approve an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       302:
 *         description: Redirects after approval
 */
router.get("/order/approve/:id", isAdminAuthenticated, orderApprove);

/**
 * @swagger
 * /admin/order/reject/{id}:
 *   get:
 *     summary: Reject and delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       302:
 *         description: Redirects after rejection
 */
router.get("/order/reject/:id", isAdminAuthenticated, orderReject);

export default router;

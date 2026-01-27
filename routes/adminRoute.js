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

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function isAdminAuthenticated(req, res, next) {
  if (req.session.admin) {
    return next();
  }
  res.redirect("/user/login");
}

/* ==================== Admin ==================== */
router.get("/", isAdminAuthenticated, adminDashboard);
router.get("/logout", isAdminAuthenticated, adminLogout);

/* ==================== Manage Product ==================== */
router.get("/product/index", isAdminAuthenticated, productIndex);
router.get("/product/add", isAdminAuthenticated, productAddPage);
router.post(
  "/product/add",
  isAdminAuthenticated,
  upload.single("image"),
  productAdd
);

router.get("/product/view", isAdminAuthenticated, productView);
router.get("/product/delete/:id", isAdminAuthenticated, productDelete);
router.get("/product/edit/:id", isAdminAuthenticated, productEditPage);
router.post(
  "/product/edit/:id",
  isAdminAuthenticated,
  upload.single("image"),
  productEdit
);

/* ==================== Manage Users ==================== */
router.get("/users/view", isAdminAuthenticated, usersView);
router.get("/user/status/:id", isAdminAuthenticated, userStatusChange);

/* ==================== Manage Orders ==================== */
router.get("/order/index", isAdminAuthenticated, orderIndex);
router.get("/order/approve/:id", isAdminAuthenticated, orderApprove);
router.get("/order/reject/:id", isAdminAuthenticated, orderReject);

export default router;

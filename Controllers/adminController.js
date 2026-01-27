import Product from "../models/product.js";
import Order from "../models/order.js";
import User from "../models/user.js";
import xss from "xss";
import { productValidation } from "../DataValidation/validation.js";

/* ==================== Admin ==================== */

export const adminDashboard = async (req, res) => {
    res.render("admin/index");
};

export const adminLogout = (req, res) => {
    if (req.session.admin) {
        delete req.session.admin;
    }
    res.redirect("/user/login?message=Logged+out+successfully");
};

/* ==================== Manage Product ==================== */

export const productIndex = async (req, res) => {
    res.render("admin/product/index");
};

export const productAddPage = async (req, res) => {
    const message = req.query.message || null;
    res.render("admin/product/add", { message });
};

export const productAdd = async (req, res) => {
    const result = productValidation.safeParse(req.body);

    if (!result.success) {
        const errorMessages = result.error.errors.map(err => err.message).join(", ");
        return res.redirect(`/admin/product/add?message=${encodeURIComponent(errorMessages)}`);
    }

    const { name, price, description } = result.data;


    const cleanName = xss(name);
    const cleanPrice = xss(price);
    const cleanDescription = xss(description);

    const existingProduct = await Product.findOne({ cleanName });
    if (existingProduct) {
        return res.redirect("/admin/product/add?message=Product+already+exist");
    }

    const file_image = req.file;

    if (!file_image) {
        return res.status(400).send("No image uploaded.");
    }

    const imageBase64 = file_image.buffer.toString("base64");
    const imageType = file_image.mimetype;

    const newproduct = new Product({
        name: cleanName,
        price: cleanPrice,
        description: cleanDescription,
        image: imageBase64,
        imagetype: imageType
    });

    await newproduct.save();
    res.redirect("/admin/product/add?message=Product+added+successfully");
};

export const productView = async (req, res) => {
    const message = req.query.message || null;
    try {
        const products = await Product.find();
        res.render("admin/product/view", { products, message });
    } catch (error) {
        res.status(500).send("Error fetching products");
    }
};

export const productDelete = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete({ _id: id });
        res.redirect("/admin/product/view?message=Product+delete+successfully");
    } catch (error) {
        res.status(500).send("Error fetching products");
    }
};

export const productEditPage = async (req, res) => {
    const message = req.query.message || null;
    const { id } = req.params;

    const product = await Product.findById({ _id: id });
    if (!product) {
        res.redirect("/admin/product/view?message=Product+not+found");
    } else {
        res.render("admin/product/edit", { product, message });
    }
};

export const productEdit = async (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const file_image = req.file;

    if (!file_image) {
        return res.status(400).send("No image uploaded.");
    }

    const imageBase64 = file_image.buffer.toString("base64");
    const imageType = file_image.mimetype;

    await Product.findByIdAndUpdate(
        { _id: id },
        { name, price, description, image: imageBase64, imagetype: imageType },
        { new: true }
    );

    res.redirect("/admin/product/view?message=Product+update+successfully");
};

/* ==================== Manage Users ==================== */

export const usersView = async (req, res) => {
    try {
        const users = await User.find({
            email: { $ne: "admin@gmail.com" }
        });

        res.render("admin/users/view", { users });
    } catch (error) {
        res.status(500).send("Error fetching users");
    }
};


export const userStatusChange = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById({ _id: id });

    if (user.status === "Active") {
        user.status = "Block";
    } else {
        user.status = "Active";
    }

    await user.save();
    res.redirect("/admin/users/view");
};

/* ==================== Manage Orders ==================== */

export const orderIndex = async (req, res) => {
    try {
        const message = req.query.message || null;

        const orders = await Order.find({})
            .populate("userId", "name")
            .sort({ createdAt: -1 })
            .lean();

        res.render("admin/order/index", { orders, message });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export const orderApprove = async (req, res) => {
    try {
        const orderId = req.params.id;
        await Order.findByIdAndUpdate(orderId, { status: "Approved" });

        res.redirect("/admin/order/index?message=Order+approved+successfully");
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

export const orderReject = async (req, res) => {
    try {
        const orderId = req.params.id;
        await Order.findByIdAndDelete(orderId);

        res.redirect("/admin/order/index?message=Order+rejected+and+deleted");
    } catch (error) {
        res.status(500).send("Error rejecting order");
    }
};

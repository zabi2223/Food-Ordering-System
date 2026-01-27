import Product from "../models/product.js";
import Cart from "../models/cart.js";
import User from "../models/user.js";
import Order from "../models/order.js";
import bcrypt from "bcryptjs";

/* ==================== User ==================== */

export const homePage = async (req, res) => {
    const message = req.query.message || null;
    res.render("user/index", { message });
};

export const productPage = async (req, res) => {
    try {
        const products = await Product.find();
        const message = req.query.message || null;

        let cartItems = [];
        if (req.session.user) {
            cartItems = await Cart.find({ userId: req.session.user._id }).lean();
        }

        res.render("user/product", {
            products,
            cartItems,
            message,
            user: req.session.user
        });
    } catch (error) {
        res.status(500).send("Error fetching products");
    }
};

export const aboutPage = async (req, res) => {
    const message = req.query.message || null;
    res.render("user/about", { message });
};

/* ==================== Cart ==================== */

export const addToCart = async (req, res) => {
    const userId = req.session.user._id;
    const { name, price, quantity, productId } = req.body;

    const newCart = new Cart({ name, price, quantity, userId, productId });
    await newCart.save();

    res.redirect("/user/product?message=Added+to+cart+successfully");
};

export const cartPage = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const cart = await Cart.find({ userId });

        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });

        res.render("user/cart", { cart, total });
    } catch (error) {
        res.status(500).send("Error fetching products");
    }
};

export const deleteCartItem = async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.redirect("/user/cart");
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

/* ==================== Checkout ==================== */

export const checkoutPage = async (req, res) => {
    const message = req.query.message || null;
    res.render("user/checkout", { message });
};

/* ==================== Place Order ==================== */

export const placeOrder = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const { name, mobile, address } = req.body;

        const cartItems = await Cart.find({ userId });

        let total = 0;
        const items = cartItems.map(item => {
            total += item.price * item.quantity;
            return {
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            };
        });

        const order = new Order({
            userId,
            name,
            mobile,
            address,
            items,
            totalAmount: total
        });

        await order.save();
        await Cart.deleteMany({ userId });

        res.redirect("/user/product?message=Order+placed+successfully");
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

/* ==================== Auth ==================== */

export const loginPage = async (req, res) => {
    const message = req.query.message || null;
    res.render("login", { message });
};

export const signupPage = async (req, res) => {
    const message = req.query.message || null;
    res.render("signup", { message });
};

export const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.redirect("/signup?message=Email+already+registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, status: "Active" });

        await newUser.save();
        res.redirect("/login?message=Account+created+successfully");
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.render("login", { message: "User not found" });
        if (user.status === "Block") return res.render("login", { message: "User Blocked" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.render("login", { message: "Incorrect password" });

        if (email === "zohaibtariq183@gmail.com") {
            req.session.admin = user;
            return res.redirect("/admin");
        }

        req.session.user = user;
        res.redirect("/user");
    } catch (error) {
        res.status(500).send("Server error");
    }
};

export const logoutUser = (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }
    res.redirect("/user?message=Logged+out+successfully");
};

/* ==================== Profile ==================== */

export const profilePage = async (req, res) => {
    try {
        const message = req.query.message || null;
        const user = await User.findById(req.session.user._id);
        res.render("user/profile", { user, message });
    } catch (error) {
        res.status(500).send("Error fetching user");
    }
};

export const changePassword = async (req, res) => {
    const { old_password, new_password } = req.body;

    try {
        const user = await User.findById(req.session.user._id);

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            return res.redirect("/user/profile?message=Incorrect+old+password");
        }

        user.password = await bcrypt.hash(new_password, 10);
        await user.save();

        res.redirect("/user/profile?message=Password+updated+successfully");
    } catch (error) {
        res.status(500).send("Server error");
    }
};

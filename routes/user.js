import express from "express";
import Product from "../database/product.js";
import Cart from "../database/cart.js";
import User from "../database/user.js";
import Order from "../database/order.js";
import bcrypt from 'bcryptjs';

const router = express.Router();

function isUserAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    res.redirect('/user/login');
}


/* ==================== User ==================== */

router.get('/', async(req,res)=>{
    const message = req.query.message || null;
    res.render("user/index", {message});
    });

router.get('/product', async (req, res) => {
  try {
    const products = await Product.find();
    const message = req.query.message || null;

    let cartItems = [];

    if (req.session.user) {
      cartItems = await Cart.find({ userId: req.session.user._id }).lean();
    }

    res.render('user/product', {
      products,
      cartItems,
      message,
      user: req.session.user
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching products');
  }
});


router.get('/about', async(req,res)=>{
    const message = req.query.message || null;
    res.render("user/about", {message});
  });

/* ==================== Cart ==================== */

router.post('/product/add', isUserAuthenticated, async (req, res) => {
  const userId = req.session.user._id;
  const { name, price, quantity, productId } = req.body;

  const newCart = new Cart({ name, price, quantity, userId, productId });
  await newCart.save();

  res.redirect("/user/product?message=Added+to+cart+successfully");
});


router.get('/cart',isUserAuthenticated, async(req,res)=>{
    try {
        const userId = req.session.user._id;
        const cart = await Cart.find({ userId });
        
        let total = 0;
        cart.forEach(item => {
          total = total + (item.price * item.quantity);
        });
        res.render('user/cart', { cart , total});
      } catch (error) {
        res.status(500).send('Error fetching products');
      }
  });

router.get('/cart/delete/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    await Cart.findByIdAndDelete(cartId);

    res.redirect('/user/cart'); 
  } catch (err) {
    console.error('Error deleting cart item:', err);
    res.status(500).send('Internal Server Error');
  }
});

/* ==================== Checkout ==================== */

router.get('/checkout', async(req,res)=>{
    const message = req.query.message || null;
    res.render("user/checkout", {message});
  });

/* ==================== Place Order ==================== */


router.post('/place-order', isUserAuthenticated, async (req, res) => {
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
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).send("Server Error");
  }
});




/* ==================== Login / Signup / Logout ==================== */

router.get('/login', async(req,res)=>{
    const message = req.query.message || null;
    res.render("user/login", {message});
  });

router.get('/signup', async(req,res)=>{
    const message = req.query.message || null;
    res.render("user/signup", {message});
  });

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
      
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.redirect('/user/signup?message=Email+already+registered');
        }
      
        const hashedPassword = await bcrypt.hash(password, 10);
      
        const newUser = new User({ name, email, password: hashedPassword , status: "Active" });
        await newUser.save();
      
        res.redirect('/user/login?message=Account+created+successfully');
        } catch (error) {
          console.error('Signup Error:', error);
          res.status(500).send('Internal Server Error');
        }
  });

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.render("user/login", { message: 'User not found' });
      }

      if (user.status === "Block") {
        return res.render("user/login", { message: 'User Blocked' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render("user/login", { message: 'Incorrect password' });
      }


      if (email === 'zohaibtariq183@gmail.com') {
        req.session.admin = user; 
        return res.redirect('/admin');
      }
  
      req.session.user = user;
      res.redirect('/user');
    } catch (err) {
      console.error('Login Error:', err);
      res.status(500).send('Server error');
    }
  });

router.get('/logout', isUserAuthenticated, (req, res) => {
    if (req.session.user) {
      delete req.session.user;
    }
    res.redirect('/user?message=Logged+out+successfully');
  });
  


/* ==================== User Profile ==================== */

router.get('/profile', isUserAuthenticated, async (req, res) => {
    try {
      const message = req.query.message || null;
      const userId = req.session.user._id;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).send('User not found');
      }

      res.render('user/profile', { user, message});
    } catch (error) {
      res.status(500).send('Error fetching user');
    }
  });


/* ==================== User Change password ==================== */

router.post('/change-password', isUserAuthenticated, async (req, res) => {
    const { old_password, new_password } = req.body;
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
            res.redirect('/user/profile?message=Incorrect+old+password');
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);

        user.password = hashedPassword;
        await user.save();

        res.redirect('/user/profile?message=Password+updated+successfully');
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).send('Server error');
    }
  });



export default router;
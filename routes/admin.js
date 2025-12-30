import express from "express";
import multer from "multer";
import Product from "../database/product.js";
import Order from "../database/order.js";
import User from "../database/user.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function isAdminAuthenticated(req, res, next) {
  if (req.session.admin) {
    return next();
  }
  res.redirect('/user/login');
}


router.get('/',isAdminAuthenticated, async(req,res)=>{
    res.render("admin/index");
  });

router.get('/logout', isAdminAuthenticated, (req, res) => {
    if (req.session.admin) {
      delete req.session.admin;
    }
    res.redirect('/user/login?message=Logged+out+successfully');
  });
    

/* ==================== Manage Product ==================== */

router.get('/product/index',isAdminAuthenticated ,async(req,res)=>{
    res.render("admin/product/index");
  });

router.get('/product/add',isAdminAuthenticated ,async(req,res)=>{
    const message = req.query.message || null;
    res.render('admin/product/add', { message });
  });

router.post('/product/add',isAdminAuthenticated ,upload.single('image') ,async(req,res)=>{
    const{name,price,description}=req.body;
    const file_image = req.file;
    if (!file_image) {
      return res.status(400).send("No image uploaded.");
    }
    const imageBase64 = file_image.buffer.toString('base64');
    const imageType = file_image.mimetype;

    const newproduct= new Product({name,price,description,image: imageBase64, imagetype: imageType});
    await newproduct.save();
    res.redirect("/admin/product/add?message=Product+added+successfully");
  });

router.get('/product/view',isAdminAuthenticated ,async(req,res)=>{
    const message = req.query.message || null;
    try {
        const products = await Product.find();
        res.render('admin/product/view', { products, message });
      } catch (error) {
        res.status(500).send('Error fetching products');
      }
  });

router.get("/product/delete/:id",isAdminAuthenticated ,async(req,res)=>{
    try {
        const  {id}=req.params;
        const deleteproduct= await Product.findByIdAndDelete({_id:id});
        const products = await Product.find();
        res.redirect("/admin/product/view?message=Product+delete+successfully");
      } catch (error) {
        res.status(500).send('Error fetching products');
      }
  });

router.get("/product/edit/:id",isAdminAuthenticated ,async(req,res)=>{
    const message = req.query.message || null;
    const  {id}=req.params;
    const product= await Product.findById({_id:id});
    if (product==null)
    {
        res.redirect("/admin/product/view?message=Product+not+found");
    }
    else
    {
        res.render("admin/product/edit",{product:product, message });
    }
  });

router.post("/product/edit/:id",isAdminAuthenticated ,upload.single('image'), async(req,res)=>{
    const  {id}=req.params;
    const{name,price,description}=req.body;
    const file_image = req.file; 
    if (!file_image) {
      return res.status(400).send("No image uploaded.");
    }
    const imageBase64 = file_image.buffer.toString('base64');
    const imageType = file_image.mimetype;

    await Product.findByIdAndUpdate({_id:id},{name,price,description,image: imageBase64, imagetype: imageType},{new:true})
    res.redirect("/admin/product/view?message=Product+update+successfully");
  }); 


/* ==================== Manage Users ==================== */

router.get('/users/view',isAdminAuthenticated ,async(req,res)=>{
  try {
      const users = await User.find();
      res.render('admin/users/view', { users });
    } catch (error) {
      res.status(500).send('Error fetching users');
    } 
  });

router.get("/user/status/:id",isAdminAuthenticated ,async(req,res)=>{
  const  {id}=req.params;
  const user = await User.findById({_id:id});
  if (user.status === 'Active')
    {
      user.status = 'Block';
    }
    else
    {
      user.status = 'Active';
    }

    await user.save();
    res.redirect("/admin/users/view");
  });

/* ==================== Manage Orders ==================== */


router.get('/order/index', isAdminAuthenticated, async (req, res) => {
  try {
    const message = req.query.message || null;
    const orders = await Order
      .find({})
      .populate('userId', 'name')           
      .sort({ createdAt: -1 })              
      .lean();                                

    res.render('admin/order/index', { orders , message });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Server Error');
  }
});

router.get("/order/approve/:id", isAdminAuthenticated, async (req, res) => {
  try {
    const orderId = req.params.id;
    await Order.findByIdAndUpdate(orderId, { status: "Approved" });

    res.redirect("/admin/order/index?message=Order+approved+successfully");
  } catch (error) {
    console.error("Error approving order:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/order/view", isAdminAuthenticated, async (req, res) => {
  try {

  } catch (error) {
    console.error("Error approving order:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/order/reject/:id", isAdminAuthenticated, async (req, res) => {
  try {
    const orderId = req.params.id;
    await Order.findByIdAndDelete(orderId);

    res.redirect("/admin/order/index?message=Order+rejected+and+deleted");
  } catch (error) {
    console.error('Error rejecting order:', error);
    res.status(500).send('Error rejecting order');
  }
});


export default router;
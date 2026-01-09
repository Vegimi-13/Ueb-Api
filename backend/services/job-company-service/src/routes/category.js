const express=require("express");
const router=express.Router();
const controller=require("../controllers/category");
const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");


router.post("/",auth,requireRole("ADMIN"),controller.createCategory);
router.get("/",controller.getAllCategories);
router.put("/:id",auth,requireRole("ADMIN"),controller.updateCategory);
router.delete("/:id",auth,requireRole("ADMIN"), controller.deleteCategory);

module.exports=router;
const express=require("express");
const router=express.Router();
const controller=require("../controllers/company");
const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");





/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *             properties:
 *               companyName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Company created successfully
 */
router.post("/",auth,requireRole("EMPLOYER","ADMIN"),controller.createCompany);

/**
 * @swagger
 * /companies/me:
 *   get:
 *     summary: Get my company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company details
 */
router.get("/me", auth,controller.getMyCompany);

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: List of all companies
 */
router.get("/",controller.getAllCompanies);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company details
 */
router.get("/:id", controller.getCompanyById);

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Update a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company updated successfully
 */
router.put("/:id",auth,requireRole("EMPLOYER","ADMIN"),controller.updateCompany);

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company deleted successfully
 */
router.delete("/:id", auth,requireRole("EMPLOYER","ADMIN"), controller.deleteCompany);


module.exports=router;
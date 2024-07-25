const mydrugController = require('../controllers/mydrugController');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /mydrugs:
 *   post:
 *     summary: Create a new drug
 *     tags: [MyDrugs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Drug created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', mydrugController.addMyDrug);

/**
 * @swagger
 * /mydrugs/{mydrugid}:
 *   put:
 *     summary: Update a drug by ID
 *     tags: [MyDrugs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mydrugid
 *         required: true
 *         schema:
 *           type: string
 *         description: The drug ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Drug updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Drug not found
 *       500:
 *         description: Internal server error
 */
router.put('/:mydrugid', mydrugController.updateMyDrug);

/**
 * @swagger
 * /mydrugs:
 *   get:
 *     summary: Get all drugs with pagination
 *     tags: [MyDrugs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of items to skip
 *     responses:
 *       200:
 *         description: List of drugs
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', mydrugController.getMyDrugs);

/**
 * @swagger
 * /mydrugs/{mydrugid}:
 *   delete:
 *     summary: Delete a drug by ID
 *     tags: [MyDrugs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mydrugid
 *         required: true
 *         schema:
 *           type: string
 *         description: The drug ID
 *     responses:
 *       204:
 *         description: Drug deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Drug not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:mydrugid', mydrugController.deleteMyDrug);

export default router

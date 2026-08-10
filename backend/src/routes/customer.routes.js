const express = require("express")
const router = express.Router()
const authenticate = require("../middleware/authenticate")
const authorize = require("../middleware/authorize")
const { validate, validateQuery } = require("../middleware/validate")
const { createCustomerSchema, updateCustomerSchema, listCustomersQuerySchema } = require("../schemas/customer.schemas")
const customerController = require("../controllers/customer.controllers")




router.use(authenticate)

router.get("/", validateQuery(listCustomersQuerySchema), customerController.listCustomers)

router.post("/", validate(createCustomerSchema), customerController.createCustomer)

router.get("/:id", customerController.getCustomer)

router.patch("/:id", validate(updateCustomerSchema), customerController.updateCustomer)

router.delete("/:id", authorize("admin"), customerController.deleteCustomer)

module.exports = router;


import express from "express";
import { body, validationResult } from "express-validator";
import { transporter } from "../utils/sendAck.js";
import { ExpressError } from "../utils/ExpressError.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/projects", (req, res) => {
  res.render("projects");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  const status = req.query.status;
  res.render("contact", { status });
});

router.post(
  "/contact",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(400).render('error', { err : errors.array() });
        throw new ExpressError(400, errors.array());
    }
    // console.log(req.body);
    const { name, email, message } = req.body;

    const adminMail = {
        from : email,
        to : process.env.EMAIL,
        subject : `New message from ${name}`,
        text : message
    }

    const userMail = {
        from : process.env.EMAIL,
        to : email,
        subject : "Thank you for reaching out!",
        text : `Hello ${name},\n\nThank you for reaching out to me. I will get back to you soon.\n\nRegards,\nOnkar Rane.`
    }

    try {
        await transporter.sendMail(adminMail);
        await transporter.sendMail(userMail);
    } catch (error) {
        console.error(error);
        throw new ExpressError(500, "Something went wrong");
    }
    res.redirect("contact?status=success");
  }
);

export default router;
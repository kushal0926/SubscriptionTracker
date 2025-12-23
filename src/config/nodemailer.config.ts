import nodemailer from "nodemailer";
import { EMAIL_PASSWORD } from "./env.ts";

export const accountEmail = "tmg.eggsy13@gmail.com";
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD
    }
});

export default transporter;
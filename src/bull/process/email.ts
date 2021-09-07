import * as dotenv from 'dotenv';
dotenv.config();
import * as nodemailer from 'nodemailer';
import { Job, DoneCallback } from 'bull';

export const sendEmailProcess = async (job: Job, done: DoneCallback) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD_EMAIL,
        }
    });

    var message = {
        from: 'PVC',
        to: job.data.email,
        subject: 'Nhận voucher',
        html: `<h2>Đây là mã voucher của ban</h2> ${job.data.voucherCode}`,
    };

    transporter.sendMail(message, function (error: Error, info) {
        if (error) {
            done(error);
        } else {
            done(null, 'Email sent: ' + info.response);
        }
    });
}
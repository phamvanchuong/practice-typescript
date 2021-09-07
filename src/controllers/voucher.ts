import { Request, ResponseToolkit } from '@hapi/hapi';
import * as mongoose from 'mongoose';

import { emailQueue } from '../bull/queues/email';
import { EventModel } from '../models/event';
import { VoucherModel } from '../models/voucher';

export const requestVoucher = async (req: Request, h: ResponseToolkit) => {
    try {
        const { email, eventId }: { email: string, eventId: string } = req.payload;
        const checkQuantity = await EventModel.findById(eventId);
        if (!checkQuantity) {
            return h.response('Event does not exist!').code(404);
        }
        if (checkQuantity.quantity <= 0) {
            return h.response('Quantity is out!').code(456);
        }

        //update event table
        await EventModel.findByIdAndUpdate(eventId, { $set: { $inc: { quantity: -1 } } });

        //generate voucher code and save voucher
        const voucherCode: string = Math.random().toString(36).substr(2, 5);
        const newVoucher = await VoucherModel.create([{ email, eventId, voucherCode }]);
        if (!newVoucher) {
            return h.response()
        }

        //send email
        await emailQueue.add({ email, voucherCode }, { attempts: 3 });

        return h.response({
            success: true,
            msg: 'Voucher code was send to your email!',
            payload: null
        });
    } catch (error) {

    }

}

//     const { email, eventId } = req.payload as any;
//     const session = await mongoose.startSession();
//     try {
//         session.startTransaction({
//             readPreference: 'primary',
//             readConcern: { level: 'local' },
//             writeConcern: { w: 'majority' }
//         });
//         const checkQuantity = await EventModel.findById(eventId, null, { session });
//         if (!checkQuantity) {
//             return h.response('Event does not exist!').code(404);
//         }
//         if (checkQuantity.quantity <= 0) {
//             return h.response('Quantity is out!').code(456);
//         }
//         console.log(checkQuantity.quantity);

//         //update event table
//         await EventModel.findByIdAndUpdate(eventId, { $inc: { quantity: -1 } }, { session });

//         //generate voucher code and save voucher
//         const voucherCode = Math.random().toString(36).substr(2, 5);
//         const newVoucher = await VoucherModel.create([{ email, eventId, voucherCode }], { session });
//         if (!newVoucher) {
//             session.abortTransaction();
//             return h.response()
//         }
//         //send email
//         // emailQueue.add({ email, voucherCode }, { attempts: 3 });

//         await session.commitTransaction();
//         return h.response({
//             success: true,
//             msg: 'Voucher code was send to your email!',
//             payload: null
//         });
//     } catch (error) {
//         await session.abortTransaction();
//         console.log(error);
//     } finally {
//         session.endSession()
//     }
// }
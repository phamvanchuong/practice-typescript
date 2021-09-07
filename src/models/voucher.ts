import * as mongoose from 'mongoose';

interface IVoucher {
    email: String,
    eventId: String,
    voucherCode: String,
}

const VoucherSchema = new mongoose.Schema<IVoucher>({
    email: String,
    eventId: String,
    voucherCode: String,
}, { timestamps: true });

export const VoucherModel = mongoose.model<IVoucher>('vouchers', VoucherSchema);
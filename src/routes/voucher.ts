import { requestVoucher } from '../controllers/voucher';
import { voucherValidation } from '../validators/voucher';

export const voucherRoutes = [
    {
        method: 'POST',
        path: '/voucher/request',
        handler: requestVoucher,
        options: {
            tags: ['api', 'voucher'],
            description: 'Create a voucher and send to mail.',
            notes: 'Return string.',
            validate: {
                payload: voucherValidation,
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    response: {}
                }
            },
        }
    },
]






// import { Request, ResponseToolkit } from '@hapi/hapi'
// import { emailQueue } from '../bull/queues/email';

// export const voucherRoutes = [
//     {
//         method: 'POST',
//         path: '/voucher',
//         handler: async (req: Request, h: ResponseToolkit) => {
//             const { email, voucherCode } = req.payload;
//             emailQueue.add({ email, voucherCode }, {
//                 attempts: 3,
//             });
//             return h.response('voucher was send to your email!');
//         },
//         options: {
//             tags: ['api'],
//             description: 'index page.',
//             notes: 'Return string.',
//         }
//     },
// ]
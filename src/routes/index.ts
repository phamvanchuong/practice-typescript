import { Server } from '@hapi/hapi'

import { eventRoutes } from './event'
import { userRoutes } from './user'
import { voucherRoutes } from './voucher'

export const routes = (server: Server) => {
    server.route([
        ...userRoutes,
        ...eventRoutes,
        ...voucherRoutes
    ])
}
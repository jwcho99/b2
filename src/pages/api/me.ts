import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { setCookie, destroyCookie } from 'nookies'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.cookies
    console.log('🚀 ~ handler ~ token:', token)

    if (token === undefined) {
        return res
            .status(401)
            .json({ status: 'error', message: 'Unauthorized' })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('🚀 ~ handler ~ decoded:', decoded)
    } catch (error) {
        return res
            .status(401)
            .json({ status: 'error', message: 'Unauthorized' })
    }

    res.status(200).json({ status: 'success' })
}

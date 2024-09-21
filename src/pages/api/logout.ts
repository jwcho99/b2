import { NextApiRequest, NextApiResponse } from 'next'
import { destroyCookie } from 'nookies'

export default function logout(req: NextApiRequest, res: NextApiResponse) {
    try {
        destroyCookie({ res }, 'token', {
            path: '/',
        })
        return res.status(200).json({ message: 'logout success' })
    } catch (error) {
        return res.status(500).json({ message: 'logout failed' })
    }
}

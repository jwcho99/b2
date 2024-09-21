import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies } from 'nookies'
import { verify } from 'jsonwebtoken'
import { createComment } from '@/apis/comments/createComment'
import { JwtPayload } from 'jsonwebtoken'

interface IJwtPayload extends JwtPayload {
    idx: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const cookies = parseCookies({ req })
        const token = cookies['token']

        if (!token) {
            return res
                .status(401)
                .json({ message: '토큰이 제공되지 않았습니다.' })
        }
        try {
            const decoded = verify(
                token,
                process.env.JWT_SECRET as string
            ) as IJwtPayload
            const userIdx = decoded.idx

            const { postIdx } = req.query

            if (req.method === 'POST') {
                await createComment(req, res, Number(postIdx), userIdx)
            } else {
                res.status(405).json({ message: '지원하지 않는 메서드입니다.' })
            }
        } catch {
            return res
                .status(401)
                .json({ status: 'fail', message: '토큰이 올바르지 않습니다.' })
        }
    } catch (error) {
        console.error('API 처리 중 오류 발생:', error)
        res.status(500).json({ message: '서버 오류가 발생했습니다.' })
    }
}

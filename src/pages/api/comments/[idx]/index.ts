import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies } from 'nookies'
import { verify } from 'jsonwebtoken'
import { getCommentByIdx } from '@/apis/comments/getComment'
import { updateComment } from '@/apis/comments/updateComment'
import { deleteComment } from '@/apis/comments/deleteComment'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { commentIdx } = req.query
    const idxStr = Array.isArray(commentIdx) ? commentIdx[0] : commentIdx
    if (
        !idxStr ||
        isNaN(parseInt(idxStr, 10)) ||
        parseInt(idxStr, 10).toString() !== idxStr
    ) {
        return res.status(400).json({ message: '유효하지 않은 idx입니다.' })
    }
    try {
        const cookies = parseCookies({ req })
        const token = cookies['token']

        if (!token) {
            return res
                .status(401)
                .json({ message: '토큰이 제공되지 않았습니다.' })
        }
        try {
            const decoded = verify(token, process.env.JWT_SECRET) as any
            const userIdx = decoded.idx
            const commentIdx = parseInt(idxStr, 10)
            const comment = await getCommentByIdx(commentIdx)

            if (!comment) {
                return res
                    .status(404)
                    .json({ message: '댓글을 찾을 수 없습니다.' })
            }
            if (req.method === 'GET') {
                return res.status(200).json(comment)
            }
            if (comment.authorIdx !== userIdx) {
                return res.status(403).json({ message: '권한이 없습니다.' })
            }
            if (req.method === 'PUT') {
                await updateComment(req, res, commentIdx)
            } else if (req.method === 'DELETE') {
                await deleteComment(req, res, commentIdx)
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
        res.status(500).json({ message: '오류가 발생했습니다.' })
    }
}

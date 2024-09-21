import { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import { getPostByIdx } from '@/apis/posts/getPost'
import { parseCookies } from 'nookies'
import { updatePost } from '@/apis/posts/updatePost'
import { deletePost } from '@/apis/posts/deletePost'
import { JwtPayload } from 'jsonwebtoken'

interface IJwtPayload extends JwtPayload {
    idx: number
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { postIdx } = req.query
    const idxStr = Array.isArray(postIdx) ? postIdx[0] : postIdx
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
            const decoded = verify(token, process.env.JWT_SECRET) as IJwtPayload
            const userIdx = decoded.idx
            const postIdxNumber = parseInt(idxStr, 10)
            const post = await getPostByIdx(postIdxNumber)

            if (!post) {
                return res
                    .status(404)
                    .json({ message: '게시글을 찾을 수 없습니다.' })
            }
            if (req.method === 'GET') {
                return res.status(200).json(post)
            }

            if (post.authorIdx !== userIdx) {
                return res.status(403).json({ message: '권한이 없습니다.' })
            }
            if (req.method === 'PUT') {
                await updatePost(req, res, postIdxNumber)
            } else if (req.method === 'DELETE') {
                await deletePost(req, res, postIdxNumber)
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

export default handler

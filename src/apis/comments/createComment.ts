import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export async function createComment(
    req: NextApiRequest,
    res: NextApiResponse,
    postIdx: number,
    authorIdx: number
) {
    const { content } = req.body

    const comment = await prisma.comment.create({
        data: {
            content,
            postIdx,
            authorIdx,
        },
    })

    res.status(201).json(comment)
}

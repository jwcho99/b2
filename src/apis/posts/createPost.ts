import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export async function createPost(
    req: NextApiRequest,
    res: NextApiResponse,
    authorIdx: number
) {
    const { title, content } = req.body

    const post = await prisma.post.create({
        data: {
            title,
            content,
            authorIdx,
        },
    })

    res.status(201).json(post)
}

import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export async function updatePost(
    req: NextApiRequest,
    res: NextApiResponse,
    idx: number
) {
    const { title, content } = req.body

    const post = await prisma.post.update({
        where: { idx },
        data: {
            title,
            content,
        },
    })

    res.status(200).json(post)
}

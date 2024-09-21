import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export async function updateComment(
    req: NextApiRequest,
    res: NextApiResponse,
    idx: number
) {
    const { content } = req.body
    const comment = await prisma.comment.update({
        where: { idx },
        data: {
            content,
        },
    })

    res.status(200).json(comment)
}

import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export async function deleteComment(
    req: NextApiRequest,
    res: NextApiResponse,
    idx: number
) {
    await prisma.comment.delete({
        where: { idx },
    })

    res.status(200).json({ message: "Comment deleted successfully" })
}

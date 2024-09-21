import { PrismaClient } from "@prisma/client"
import { NextApiResponse } from "next"

const prisma = new PrismaClient()

export async function getCommentByIdx(idx: number) {
    return prisma.comment.findUnique({
        where: { idx },
    })
}

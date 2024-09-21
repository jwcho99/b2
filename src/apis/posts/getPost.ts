import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export async function getAllPosts(req: NextApiRequest, res: NextApiResponse) {
    const { page = 1, limit = 10 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    try {
        const posts = await prisma.post.findMany({
            skip,
            take: Number(limit),
            orderBy: { createdAt: "desc" },
        })

        const totalPosts = await prisma.post.count()

        res.status(200).json({
            posts,
            totalPosts,
            totalPages: Math.ceil(totalPosts / Number(limit)),
        })
    } catch (error) {
        console.error("Error fetching posts:", error)
        res.status(500).json({ message: "Error fetching posts" })
    }
}

export const getPostByIdx = async (idx: number) => {
    return prisma.post.findUnique({
        where: { idx },
        include: {
            comments: true,
        },
    })
}

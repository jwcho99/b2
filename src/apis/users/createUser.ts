import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const { password, nickname, email } = req.body
    if (
        password === undefined ||
        nickname === undefined ||
        email === undefined
    ) {
        return res
            .status(400)
            .json({ message: '닉네임, 이메일, 비밀번호가 필요합니다.' })
    }

    const hashedPassword = await hash(password, 10)
    const user = await prisma.user.create({
        data: {
            nickname,
            email,
            password: hashedPassword,
        },
    })

    res.status(200).json({ status: 'success', idx: user.idx })
}

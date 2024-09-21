-- CreateTable
CREATE TABLE "User" (
    "idx" SERIAL NOT NULL,
    "nickname" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Post" (
    "idx" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "content" TEXT,
    "authorIdx" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("idx")
);

-- CreateTable
CREATE TABLE "Comment" (
    "idx" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "postIdx" INTEGER NOT NULL,
    "authorIdx" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("idx")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorIdx_fkey" FOREIGN KEY ("authorIdx") REFERENCES "User"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postIdx_fkey" FOREIGN KEY ("postIdx") REFERENCES "Post"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorIdx_fkey" FOREIGN KEY ("authorIdx") REFERENCES "User"("idx") ON DELETE RESTRICT ON UPDATE CASCADE;

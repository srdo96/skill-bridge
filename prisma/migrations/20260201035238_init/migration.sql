-- CreateTable
CREATE TABLE "Category" (
    "category_id" TEXT NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "desc" VARCHAR(250),
    "img_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "subject_id" TEXT NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "img_url" TEXT,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("subject_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_name_key" ON "blogs"("name");

-- CreateIndex
CREATE INDEX "blogs_subject_id_idx" ON "blogs"("subject_id");

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

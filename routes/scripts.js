const express = require("express")
const auth = require("../middleware/auth")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
const router = express.Router()

router.post("/upload", auth, async (req, res) => {
  const { name, description, code } = req.body

  const script = await prisma.script.create({
    data: {
      name,
      description,
      code,
      ownerId: req.user.id
    }
  })

  res.json(script)
})

router.get("/discover", async (req, res) => {
  const scripts = await prisma.script.findMany({
    include: { owner: true },
    orderBy: { score: "desc" },
    take: 50
  })

  res.json(scripts)
})

module.exports = router

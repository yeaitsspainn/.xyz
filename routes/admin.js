const express = require("express")
const auth = require("../middleware/auth")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
const router = express.Router()

router.use(auth)

router.post("/ban", async (req, res) => {
  if (req.user.role !== "owner") return res.sendStatus(403)

  const { userId, reason } = req.body

  await prisma.user.update({
    where: { id: userId },
    data: { banned: true, banReason: reason }
  })

  res.json({ success: true })
})

router.get("/logs", async (req, res) => {
  if (req.user.role !== "owner") return res.sendStatus(403)
  const logs = await prisma.log.findMany({ orderBy: { createdAt: "desc" } })
  res.json(logs)
})

module.exports = router

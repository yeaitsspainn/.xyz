const express = require("express")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
const router = express.Router()

router.post("/", async (req, res) => {
  if (req.headers.authorization !== `Bot ${process.env.BOT_KEY}`) {
    return res.status(401).json({ error: "unauthorized" })
  }

  const { discord_id, username } = req.body
  const user = await prisma.user.findUnique({ where: { username } })

  if (!user || user.discordId !== discord_id) {
    return res.status(400).json({ error: "discord not linked" })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { discordVerified: true }
  })

  res.json({ success: true })
})

module.exports = router

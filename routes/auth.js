const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
const { hashHWID } = require("../utils/hwid")

const prisma = new PrismaClient()
const router = express.Router()

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body
  const hash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { username, email, password: hash }
  })

  res.json({ success: true })
})

router.post("/login", async (req, res) => {
  const { email, password, hwid } = req.body
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || user.banned) return res.status(403).json({ error: "access denied" })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: "wrong password" })

  const hashed = hashHWID(hwid)

  if (!user.hwid) {
    await prisma.user.update({
      where: { id: user.id },
      data: { hwid: hashed }
    })
  } else if (user.hwid !== hashed) {
    return res.status(403).json({ error: "hwid mismatch" })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
  )

  res.cookie("token", token, { httpOnly: true })
  res.json({ success: true })
})

module.exports = router

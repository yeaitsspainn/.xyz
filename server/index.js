const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const auth = require("./routes/auth")
const scripts = require("./routes/scripts")
const verify = require("./routes/verify")
const admin = require("./routes/admin")

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", auth)
app.use("/api/scripts", scripts)
app.use("/api/verify", verify)
app.use("/api/admin", admin)

app.listen(3000, () => console.log("🚀 server running"))

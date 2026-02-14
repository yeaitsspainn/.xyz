const crypto = require("crypto")

module.exports.hashHWID = hwid =>
  crypto.createHash("sha256").update(hwid).digest("hex")

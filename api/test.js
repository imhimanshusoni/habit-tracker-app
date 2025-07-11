const bcrypt = require("bcryptjs");

const hashedPassword =
  "$2b$10$GGRcQqW70/gzLY136tTTNuU1pyqtcuq4Zzvi/jDXI1Z3nSdgaWFsu";
const plaintextPassword = "123456";

bcrypt.compare(plaintextPassword, hashedPassword).then((result) => {
  console.log("Compare result:", result); // should print true or false
});

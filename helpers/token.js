import jwt from "jsonwebtoken"

const token = {
    generateToken(data) {
    const secret = process.env.secret;
    const token = jwt.sign({
      currentUser: data
    }, secret, { expiresIn: '8h'})
    return token;
  }
}
export default token;
import bcrypt from 'bcryptjs'

import db from '../database/db';
import generator from '../helpers/token'

class Users {
  static signup (req, res) {
    const {
      username, email, password, securityQuestion, securityAnswer
    } = req.body;
    const trimmedUser = username.trim();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const hashedAnswer = bcrypt.hashSync(securityAnswer, 10);
    const createdon = new Date();
    const curentUser = {
        username: trimmedUser,
        email
    }
    const token = generator.generateToken(curentUser);
    db.query('INSERT INTO users ( email, username, password, question, answer, createdon) VALUES ($1, $2, $3, $4, $5, $6)', [ email, trimmedUser, hashedPassword, securityQuestion, hashedAnswer, createdon], (err, results) => {
        if(err) {
            if (err.code == 23505){
                return res.status(409).send({
                    status: 409,
                    message: "The email already exists"
                })
            }
            throw err
        };
        return res.status(201).send({
            message: "Sign up successful",
            curentUser,
            Token: token
        })
        }
      );
  }

  static signin (req, res) {
    const { email } = req.body;
    const curentUser = {
        email
    }
    const token = generator.generateToken(curentUser);
    return res.status(200).send({
        message: "Login successful",
        curentUser,
        Token: token
    })
  }
  
  static resetPassword (req, res) {
    const { email, newPassword } = req.body;
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email], (error, result) => {
        if (error) throw error;
        return res.status(201).send({
            status: 201,
            message: "Password reset successful"
        })
    })
  }
}
export default Users;

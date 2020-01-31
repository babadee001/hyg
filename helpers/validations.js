import bcrypt from "bcryptjs";

import pool from "../database/db";

export default {
  validateUser(req, res, next) {
    req.checkBody(
      {
        email: {
          isEmail: true,
          notEmpty: true,
          errorMessage: {
            status: 400,
            message: 'The email field is required with a valid email address.'
          }
        },
        username: {
          notEmpty: true,
          isLength: {
            options: [{ min: 2 }],
            errorMessage: {
              status: 400,
              message: 'The username field is required with minimum of two characters and no white spaces.',
            }
          },
          errorMessage: {
            status: 400,
            message: 'The username field is required.'
          }
        },
        securityQuestion: {
          notEmpty: true,
          isLength: {
            options: [{ min: 6 }],
            errorMessage: {
              status: 400,
              message: 'The security question field is required with minimum of 6 characters.',
            }
          },
          errorMessage: {
            status: 400,
            message: 'The securityQuestion field is required.'
          }
        },
        securityAnswer: {
          notEmpty: true,
          errorMessage: {
            status: 400,
            message: 'The securityAnswer field is required.'
          }
        },
        password: {
          notEmpty: true,
          isLength: {
            options: [{ min: 4 }],
            errorMessage: {
              status: 400,
              message: 'The password field is requuired to be a minimum of 4 characters.'
            }
          },
          errorMessage: {
            status: 400,
            message: 'The password field is required.'
          }
        },
      },
    );
    const errors = req.validationErrors();
    if (errors) {
      const allErrors = [];
      errors.forEach((error) => {
        const errorMessage = error.msg;
        allErrors.push(errorMessage);
      });
      return res.status(400)
        .json({
          message: allErrors[0],
        });
    }
    next();
  },
  validateLogin(req, res, next){
    req.checkBody(
      {
        email: {
          notEmpty: true,
          isAlphanumeric: false,
          errorMessage: 'Enter a valid username',
        },
        password: {
          notEmpty: true,
          isAlphanumeric: false,
          errorMessage: 'Enter valid password',
        },
      });
      pool.query('SELECT * FROM users WHERE email = $1 ', [req.body.email], (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rows[0] && results.rows[0].email && req.body.password && bcrypt.compareSync(req.body.password, results.rows[0].password)){
          next()
        }
        else {
          return res.status(401).send({
            status: 401,
            message: "Invalid email or password"
          })
        }
      })
    }
}
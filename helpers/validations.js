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
          errorMessage: 'Enter a valid email',
        },
        password: {
          notEmpty: true,
          isAlphanumeric: false,
          errorMessage: 'Enter valid password',
        },
      });
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
    },
    validateReset(req, res, next){
      req.checkBody(
        {
          email: {
            notEmpty: true,
            isAlphanumeric: false,
            errorMessage: 'Make sure you have provided a valid email',
          },
          newPassword: {
            notEmpty: true,
            isAlphanumeric: false,
            errorMessage: 'Provide valid new password.',
          },
          securityAnswer: {
            notEmpty: true,
            isAlphanumeric: false,
            errorMessage: 'Security answer can not be empty.',
          },
        });
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
        pool.query('SELECT answer FROM users WHERE email = $1 ', [req.body.email], (error, results) => {
          if (error) {
            throw error;
          }
          if (results.rows[0] && bcrypt.compareSync(req.body.securityAnswer, results.rows[0].answer)){
            next()
          }
          else {
            return res.status(401).send({
              status: 401,
              message: "Make sure you provide a valid security question/answer"
            })
          }
        })
      },

      validateData(req, res, next){
        req.checkBody(
          {
            username: {
              notEmpty: true,
              isAlphanumeric: false,
              errorMessage: 'Make sure you have provided a valid username',
            },
            firstData: {
              notEmpty: true,
              isNumeric: true,
              errorMessage: 'Provide valid data and it must be numeric.',
            },
            secondData: {
              notEmpty: true,
              isNumeric: true,
              errorMessage: 'Provide valid data and it must be numeric.',
            },
            latitude: {
              notEmpty: true,
              isDecimal: true,
              errorMessage: 'Provide valid latitude. Should be decimal',
            },
            longitude: {
              notEmpty: true,
              isDecimal: true,
              errorMessage: 'Provide valid longitude. Should be decimal',
            }
          });
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
          next()
        },
        validateDataEdit(req, res, next){
          if (isNaN(req.params.id) || (req.params.id % 1) != 0){
            return res.status(401).send({
              status: 401,
              message: "Invalid ID"
          })}
          pool.query('SELECT * FROM data WHERE id = $1 ', [req.params.id], (error, results) => {
            if (error) {
              throw error;
            }
            if (results.rows[0] && results.rows[0].id){
              req.dataEdit = {
                longitude: req.body.longitude || results.rows[0].longitude,
                latitude: req.body.latitude || results.rows[0].latitude,
                firstData: req.body.firstData || results.rows[0].firstdata,
                secondData: req.body.secondData || results.rows[0].seconddata,
              }
              if (isNaN(req.dataEdit.firstData) || isNaN(req.dataEdit.secondData) || isNaN(req.dataEdit.latitude) || isNaN(req.dataEdit.longitude)){
                return res.status(401).send({
                  status: 401,
                  message: "Invalid input field. Expecting decimal."
                })
              }
              next();
            }
            else {
              return res.status(401).send({
                status: 401,
                message: "Invalid ID."
              })
            }
          })
        },

        validateDataDelete(req, res, next){
          if (isNaN(req.params.id) || (req.params.id % 1) != 0){
            return res.status(401).send({
              status: 401,
              message: "Invalid ID"
          })}
          pool.query('SELECT id FROM data WHERE id = $1 ', [req.params.id], (error, results) => {
            if (error) {
              throw error;
            }
            if (results.rows[0] && results.rows[0].id){
              next()
            }
            else {
              return res.status(401).send({
                status: 401,
                message: "Invalid ID."
              })
            }
          })
          }
}
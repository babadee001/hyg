import express from 'express';
import UsersController from '../controllers/users';
import validator from '../helpers/validations';

const usersRouter = express.Router();

usersRouter.route('/signup').post(validator.validateUser, UsersController.signup);
usersRouter.route('/signin').post(validator.validateLogin, UsersController.signin);

export default usersRouter;

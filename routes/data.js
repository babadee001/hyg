import express from 'express';
import DataController from '../controllers/users';
import validator from '../helpers/validations';

const dataRouter = express.Router();

// dataRouter.route('/data').post(DataController.postData);
// dataRouter.route('/data').get(DataController.getData);
// dataRouter.route('/data').put(DataController.editData);

export default dataRouter;

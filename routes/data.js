import express from 'express';
import DataController from '../controllers/data';
import validator from '../helpers/validations';

const dataRouter = express.Router();

dataRouter.route('/data').post(validator.validateData, DataController.postData);
dataRouter.route('/data').get(DataController.getData);
dataRouter.route('/data/:id').put(validator.validateDataEdit, DataController.editData);
dataRouter.route('/data/:id').delete(validator.validateDataDelete, DataController.deleteData);

export default dataRouter;

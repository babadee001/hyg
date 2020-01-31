i
import db from '../database/db';

class Users {
  static postData (req, res) {
    return res.status(201).send({
        status: 201,
        message: "data posted"
    })
  }

  static getData (req, res) {
    return res.status(200).send({
        status: '200',
        message: "Data load successful"
    })
  }
}
export default Users;

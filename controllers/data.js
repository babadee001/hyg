import db from '../database/db';

class Data {
  static postData (req, res) {
    const createdon = new Date();
    const { username, firstData, secondData, latitude, longitude } = req.body;
    db.query('INSERT INTO data ( username, firstdata, seconddata, latitude, longitude, createdon) VALUES ($1, $2, $3, $4, $5, $6)', [ username, firstData, secondData, latitude, longitude, createdon], (error, results) => {
      if(error) throw error;
    return res.status(201).send({
        status: 201,
        message: "data posted successfully"
    })
    })
  }

  static getData (req, res) {
    db.query('SELECT * FROM data', (error, results) => {
      if (error) throw error;
      return res.status(200).send({
        status: '200',
        data: results.rows
    })
    })
  }

  static editData (req, res) {
    const { firstData, secondData, latitude, longitude } = req.dataEdit;
    db.query('UPDATE data SET firstData = $1, secondData = $2, latitude = $3, longitude = $4 WHERE id = $5', [firstData, secondData, latitude, longitude, req.params.id], (error, result) => {
      if (error) throw error;
      return res.status(201).send({
          status: 201,
          message: "data updated successfully"
      })
  })
  }

  static deleteData (req, res) {
    const { id } = req.params;
    db.query('DELETE FROM data WHERE id = $1',[id], (error, results) => {
      if (error) throw error;
      return res.status(200).send({
        status: '200',
        message: "Deleted successfully"
    })
    })
  }
  
}
export default Data;

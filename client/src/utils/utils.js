import jwt from 'jsonwebtoken';

class Utils {
    static async getData (){
        const response = await fetch('/data', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }).catch((error) => {
            if (error.response) {
                this.setState({
                    errorMessage: error.response.data.message
                })
            } else {
              throw error;
            }
          });
          const jsonServerResponse = await response.json()
                  .then(jsonData => jsonData);
          return jsonServerResponse;
    }
    static async deleteData(id) {
        const response = await fetch(`/data/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          }).catch((error) => {
            if (error.response) {
                this.setState({
                    errorMessage: error.response.data.message
                })
            } else {
              throw error;
            }
          });
          const jsonServerResponse = await response.json()
                  .then(jsonData => jsonData);
          return jsonServerResponse;
    }

    static async verifyToken(token) {
      if (!token){
        return false;
      }
      jwt.verify(token, 'babadee', (err, decoded) => {
        if (err){
          console.log("eeeee", err)
          return false
        }
        return true
      })
    }
}
export default Utils;
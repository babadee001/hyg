import Swal from 'sweetalert2';

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

    static async fireAlert() {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This is not reversible',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
          }).then((result) => {
            if (result.value) {
              Swal.fire(
                'Deleted!',
                'Data successfully deleted.',
                'success'
              )
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelled',
                'Data not deleted :)',
                'error'
              )
            }
          })
    }
}
export default Utils;
import React, { Component } from 'react';
import toastr from 'toastr';
import Swal from 'sweetalert2'
import jwt from 'jsonwebtoken';
import './style.scss';
import utils from '../../utils/utils';
import Navbar from '../navbar';

export default class Data extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstData: '',
      secondData: '',
      lat: '',
      long: '',
      errorMessage: '',
      successMessage: '',
      allData: '',
      dataReady: false,
      filteredData: '',
      searchQuery: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.postData = this.onSubmit.bind(this);
    this.renderTableData = this.renderTableData.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillMount(){
    utils.getData()
    .then((jsonServerResponse) => {
      if (jsonServerResponse.status == 200) {
        this.setState({
          allData: jsonServerResponse.data
        })
        console.log(this.state)
      } else {
        toastr.info('Could not load data. Connection may be slow')
      }
    })
  }

  search = () => {
    let { searchQuery, allData } = this.state;
    let filteredData = allData.filter(value => {
    return (
        value.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    this.setState({ filteredData });
};

  renderTableData() {
    const currentData = this.state.filteredData && this.state.filteredData.length ? this.state.filteredData : this.state.allData;
    return currentData.map((data, index) => {
       const { id, username, firstdata, seconddata, latitude,longitude } = data 
       return (
          <tr key={id}>
             <td>{id}</td>
             <td>{username}</td>
             <td>{firstdata}</td>
             <td>{seconddata}</td>
             <td>{latitude}</td>
             <td>{longitude}</td>
             <td><button className="btn-success addbtn" data-toggle="modal" data-target="#editModal">Edit</button><button onClick={() => this.deleteData(id)} className="btn-danger">Delete</button></td>
          </tr>
       )
    })
 }

 deleteData(id) {
   utils.deleteData(id)
   .then((jsonServerResponse) => {
    if (jsonServerResponse.status == 200) {
      toastr.info('Deleted')
      console.log(this.state)
    } else {
      toastr.info('Could not load data. Connection may be slow')
    }
  })
  let copyArray = this.state.allData;
  const index = copyArray.findIndex(x => x.id === id);
  console.log(index)
  copyArray.splice(index, 1);
  this.setState({ allData: copyArray });
 }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    console.log(this.state)
  }

  onSubmit = async event => {
    event.preventDefault();
    const decoded = jwt.decode(localStorage.getItem('token'));
    const username = decoded.currentUser.email;
    const { firstData, secondData, lat, long } = this.state
    const latitude = Number(lat)
    const longitude = Number(long)
    const response = await fetch('/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstData, secondData, latitude, longitude, username
      }),
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
    if (jsonServerResponse.status === 201) {
      toastr.info(jsonServerResponse.message)
      this.setState({
        errorMessage: '',
        successMessage: 'Data added successfully. Close the form or add new data'
      })
    } else {
      this.setState({
          errorMessage: jsonServerResponse.message.message || jsonServerResponse.message
      })
    }
  }

  onhandleEdit = async event => {
    event.preventDefault();
    console.log('edit')
    const { firstData, secondData, lat, long } = this.state
    const latitude = Number(lat)
    const longitude = Number(long)
    const response = await fetch('/data', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstData, secondData, latitude, longitude
      }),
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
    if (jsonServerResponse.status === 201) {
      toastr.info(jsonServerResponse.message)
      this.setState({
        errorMessage: '',
        successMessage: 'Data edited successfully. Close the form or edit again'
      })
    } else {
      this.setState({
          errorMessage: jsonServerResponse.message.message || jsonServerResponse.message
      })
    }
  }

  render() {
    const allData = this.state.allData;
    if (!allData) {
      return "No data"
    }
    return (
      <div>
        <Navbar />
        <div className="spacing"></div>
        <div className='data-title'>Data Table</div>
        <button data-toggle="modal" data-target="#exampleModal" className="btn btn-success addbtn">Add new</button>
        <div className='search'>
          <input name="searchQuery" onChange={this.onChange} value={this.state.searchQuery}></input>
          <button onClick={this.search}>Search</button>
        </div>
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add New Data</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
              <form onSubmit={this.onSubmit}>
              <p className="errormessage">{this.state.errorMessage}</p>
              <p className="successMessage">{this.state.successMessage}</p>
                <div className="form-group">
                  <label className="col-form-label">firstData:</label>
                  <input name="firstData" type="text" className="form-control" value={this.state.firstData} onChange={ this.onChange } required></input>
                </div>
                <div className="form-group">
                  <label className="col-form-label">secondData:</label>
                  <input name="secondData" type="text" className="form-control" value={this.state.secondData} onChange={ this.onChange } required></input>
                </div>
                <div className="form-group">
                  <label className="col-form-label">Latitude:</label>
                  <input name="lat" type="text" className="form-control" value={this.state.lat} onChange={ this.onChange } required></input>
                </div>
                <div className="form-group">
                  <label className="col-form-label">Longitude:</label>
                  <input name="long" type="text" className="form-control" value={this.state.long} onChange={ this.onChange } required></input>
                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">CLose</button>
                <button type="submit" className="btn btn-primary">Add</button>
              </div>
              </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModal" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editModal">Edit Data</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
              <form onSubmit={this.onhandleEdit}>
              <p className="errormessage">{this.state.errorMessage}</p>
              <p className="successMessage">{this.state.successMessage}</p>
                <div className="form-group">
                  <label className="col-form-label">firstData:</label>
                  <input name="firstData" type="text" className="form-control" value={this.state.firstData} onChange={ this.onChange } required></input>
                </div>
                <div className="form-group">
                  <label className="col-form-label">secondData:</label>
                  <input name="secondData" type="text" className="form-control" value={this.state.secondData} onChange={ this.onChange } required></input>
                </div>
                <div className="form-group">
                  <label className="col-form-label">Latitude:</label>
                  <input name="lat" type="text" className="form-control" value={this.state.lat} onChange={ this.onChange } required></input>
                </div>
                <div className="form-group">
                  <label className="col-form-label">Longitude:</label>
                  <input name="long" type="text" className="form-control" value={this.state.long} onChange={ this.onChange } required></input>
                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Edit</button>
              </div>
              </form>
              </div>
            </div>
          </div>
        </div>
        <table id="data" className="table table-striped table-bordered">
        <thead>
            <tr>
                <th>id</th>
                <th>Username</th>
                <th>Data1</th>
                <th>Data2</th>
                <th>Longitude</th>
                <th>Latitude</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
              {this.renderTableData()}
        </tbody>

    </table>
      </div>
  )
}
}
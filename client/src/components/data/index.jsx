import React, { Component } from 'react';
import { MDBDataTable, MDBContainer } from 'mdbreact';
import toastr from 'toastr';
import jwt from 'jsonwebtoken';
import './style.scss';
import utils from '../../utils/utils';
import Navbar from '../navbar';
// import { BrowserRouter } from 'react-router-dom';

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
      searchQuery: '',
      editId: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.postData = this.onSubmit.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.search = this.search.bind(this);
    this.setEditId = this.setEditId.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.renderTable = this.renderTable.bind(this);
  }

  componentDidMount(){
    utils.getData()
    .then((jsonServerResponse) => {
      // eslint-disable-next-line
      if (jsonServerResponse.status == 200) {
        this.setState({
          allData: jsonServerResponse.data
        })
      } else {
        toastr.info('Could not load data. Connection may be slow')
      }
    })
  }
 
  // paginate(num){
  //   const currentData = this.state.filteredData && this.state.filteredData.length ? this.state.filteredData : this.state.allData;
  //   const checkValue = (val) => {
  //     if (val < currentData.length){
  //     currentValue = num
  //     }
  //  }
    
  //   const currentValue = num > currentData.length ? currentData.length : num
  //   const filtered = []
  //   for (let i=0; i<num; i++){
  //     filtered[i] = currentData[i]
  //   }
  //   // this.setState({
  //   //   filteredData: filtered
  //   // })
  // }


  setEditId(id, firstData, secondData, latitude, longitude){
    this.setState({
      editId: id,
      successMessage: '',
      errorMessage: '',
      firstData: firstData,
      secondData: secondData,
      lat: latitude,
      long: longitude,
    })
  }

  clearFields(){
    this.setState({
      successMessage: '',
      firstData: '',
      secondData: '',
      lat: '',
      long: '',
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


 renderTable(){
    const currentData = this.state.filteredData.length ? this.state.filteredData : this.state.allData;
    for (let i=0; i<currentData.length; i++){
      const { id, firstdata, seconddata, latitude,longitude } = currentData[i] 
      currentData[i]['actions'] = <div className="btn-group group">
      <button align="center" onFocus={() => this.setEditId(id, firstdata, seconddata, latitude, longitude)} className="btn-success" data-toggle="modal" data-target="#editModal">Edit</button>
      <button align="center" onClick={() => this.deleteData(id)} className="btn-danger deletebtn">Delete</button>
    </div>
    }
    const data = {
      columns: [
        {
          label: 'Id',
          field: 'id',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Username',
          field: 'username',
          sort: 'asc',
          width: 270
        },
        {
          label: 'Data1',
          field: 'firstdata',
          sort: 'asc',
          width: 200
        },
        {
          label: 'Data2',
          field: 'seconddata',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Longitude',
          field: 'longitude',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Latitude',
          field: 'latitude',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Actions',
          field: 'actions',
          sort: 'asc',
          width: 150
        },
      ],
      rows: currentData
    };
    return (
      <MDBContainer>
        <MDBDataTable
          responsive
          striped
          bordered
          hover
          searching= {false}
          data={data}
        />
      </MDBContainer>
    )
 }

 deleteData(id) {
   utils.deleteData(id)
   .then((jsonServerResponse) => {
     // eslint-disable-next-line
    if (jsonServerResponse.status == 200) {
      toastr.info('Deleted')
    } else {
      toastr.info('Could not load data. Connection may be slow')
    }
  })
  let copyArray = this.state.allData;
  const index = copyArray.findIndex(x => x.id === id);
  copyArray.splice(index, 1);
  this.setState({ allData: copyArray });
 }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit = async event => {
    event.preventDefault();
    const decoded = jwt.decode(localStorage.getItem('token'));
    if (!decoded){
      this.setState({errorMessage: 'Please login'})
    }
    else{
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
      utils.getData()
        .then((jsonServerResponse) => {
          // eslint-disable-next-line
          if (jsonServerResponse.status == 200) {
            this.setState({
              allData: jsonServerResponse.data
            })
          } else {
            toastr.info('Could not load data. Connection may be slow')
          }
        })
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
  }

  onhandleEdit = async (event, id) => {
    event.preventDefault();
    const verified = utils.verifyToken(localStorage.getItem('token'))
    if (!verified){
      this.setState({errorMessage: "Please Login"})
    }
    else {
      const { firstData, secondData, lat, long } = this.state
      const latitude = Number(lat)
      const longitude = Number(long)
      const response = await fetch(`/data/${id}`, {
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
      console.log(jsonServerResponse)
      if (jsonServerResponse.status === 201) {
        utils.getData()
          .then((jsonServerResponse) => {
            // eslint-disable-next-line
            if (jsonServerResponse.status == 200) {
              this.setState({
                allData: jsonServerResponse.data
              })
            } else {
              toastr.info('Could not load data. Connection may be slow')
            }
          })
        toastr.info(jsonServerResponse.message.message || jsonServerResponse.message)
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
  }

  render() {
    const allData = this.state.allData;
    // eslint-disable-next-line
    if (allData.length == 0) {
      return (
        <div>
          <p>Loading</p>
          <div className="spinner-grow text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        </div>
      )
    }
      return (
        <div>
          <Navbar link1="/" value1="Logout" />
          <div className="container container-fluid">
          <div className="head-group">
            <div className="spacing"></div>
            <div className="data-title"><p className="text-center">Data Table</p></div>
            <p className="text-center">
            <button onFocus={this.clearFields} data-toggle="modal" data-target="#exampleModal" className="btn btn-success">Add new</button>
            </p>
            <div className="row">
              <div className="col-md-2"></div>
              <div className="input-group col-md-8">
                  <input className="form-control" placeholder="search by username"  name="searchQuery" onChange={this.onChange} value={this.state.searchQuery}></input>
                  <div className="input-group-append">
                    <button type="button" className="btn btn-secondary" onClick={this.search}><i className="fa fa-search"></i></button>
                  </div>
              </div>
            </div>
          </div>
          <div className="container">
            {this.renderTable()}
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
                <form onSubmit={(event) => { this.onhandleEdit(event, this.state.editId) }}>
                <p className="errormessage">{this.state.errorMessage}</p>
                <p className="successMessage">{this.state.successMessage}</p>
                  <div className="form-group">
                    <label className="col-form-label">firstData:</label>
                    <input name="firstData" type="text" className="form-control" value={this.state.firstData} onChange={ this.onChange }></input>
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">secondData:</label>
                    <input name="secondData" type="text" className="form-control" value={this.state.secondData} onChange={ this.onChange }></input>
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">Latitude:</label>
                    <input name="lat" type="text" className="form-control" value={this.state.lat} onChange={ this.onChange }></input>
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">Longitude:</label>
                    <input name="long" type="text" className="form-control" value={this.state.long} onChange={ this.onChange }></input>
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
        </div>
        </div>
    )
  }
}
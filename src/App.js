import './App.css';
import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeFName=this.handleChangeFName.bind(this);
    this.handleChangeMobile=this.handleChangeMobile.bind(this);
    this.handleChangeAddress=this.handleChangeAddress.bind(this);
    this.handleChangeCourse=this.handleChangeCourse.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.handleDelete=this.handleDelete.bind(this);
    this.handleEdit=this.handleEdit.bind(this);
    this.state = {
      name: '',
      mobile: '',
      address:'',
      course:'',
      gridData:[],
      type:'submit',
      editId: 0
    };
  }

  handleChangeFName(e){
    this.setState({name:e.target.value});
  }
  handleChangeMobile(e){
    this.setState({mobile:e.target.value});
  }
  handleChangeAddress(e){
    this.setState({address:e.target.value});
  }
  handleChangeCourse(e){
    this.setState({course:e.target.value});
  }
  
  GetDataGrid(){
    var self = this;
    axios.get('https://radiant-eyrie-80040.herokuapp.com/GetStudent')
      .then(function (response) {
        console.log('getdata')
        self.setState({ gridData: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount(){
    this.GetDataGrid()
  }

  handleSubmit(e){
    console.log(' submit executed')
    var self=this;
    axios.post('https://radiant-eyrie-80040.herokuapp.com/PostStudent', JSON.stringify(this.state),{ headers: { "Content-Type": "application/json" } })
    .then(function (response) {
      self.GetDataGrid()
    })
    .catch(function (error) {
      console.log(error);
    });

    e.preventDefault();
  }
  handleDelete(id){
    var self=this
    console.log(id)
    console.log(JSON.stringify({"ID":id}))
    axios.delete('https://radiant-eyrie-80040.herokuapp.com/DeleteStudent', {data:JSON.stringify({"ID":id}), headers: { "Content-Type": "application/json" } })
    .then(function (response) {
      console.log(response.data);
      self.GetDataGrid()
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleUpdate(data){
    this.setState({type:'e'})
    this.setState({name:data.NAME,course:data.COURSE,mobile:data.MOBILE,address:data.ADDRESS,editId:data.ID});
  }

  handleEdit(e){
    var data={
      name:this.state.name,
      address:this.state.address,
      mobile:this.state.mobile,
      course:this.state.course,
      id:this.state.editId
    }
    console.log('edit executed')
    var self=this;
    axios.put('https://radiant-eyrie-80040.herokuapp.com/PutStudent', data,{ headers: { "Content-Type": "application/json" } })
    .then(function (response) {
      self.GetDataGrid()
      self.setState({type:'submit'})
    })
    .catch(function (error) {
      console.log(error);
    });
    e.preventDefault();
  }

  render(){
    var grid=this.state.gridData
  return (
    <div className="App">
      <div className="container">
      <form>
        <div className="form-group">
          <label htmlFor="fname" style={{"color":"black","backgroundColor":"white"}}>Name</label>
          <input className="form-control" type="text" id="fname" name="firstname" value={this.state.name} onChange={this.handleChangeFName} placeholder="Your name.." />
        </div>
        <div  className="form-group">
          <label htmlFor="mobile">Mobile</label>
          <input className="form-control" type="text" id="mobile" name="mobile" value={this.state.mobile} onChange={this.handleChangeMobile} placeholder="Your Mobile" />
        </div>
        <div  className="form-group">
          <label htmlFor="address">Address</label>
          <input className="form-control" type="text" id="address" name="address" value={this.state.address} onChange={this.handleChangeAddress} placeholder="Your Address.." />
        </div>
        <div  className="form-group">
          <label htmlFor="course">Course</label>
          <select className="form-control" id="course" name="course" value={this.state.course} onChange={this.handleChangeCourse}>
          <option value="">Select</option>
            <option value="B.Tech">B.Tech</option>
            <option value="B.Pharma">B.Pharma</option>
            <option value="BCA">BCA</option>
          </select>
        </div>
        <div  className="form-group">
          {this.state.type==='submit' ? <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button> 
          : <button className="btn btn-primary" onClick={this.handleEdit}>Update</button>
           }
          
          {/* <input type="submit" value="Submit" /> */}
        </div>
      </form>
      
      <div className="table-responsive">
      <table className="table-bordered">
  <tr>
    <th>ID</th>
    <th>NAME</th>
    <th>COURSE</th>
    <th>ADDRESS</th>
    <th>MOBILE</th>
  </tr>
  {
    grid.map((data,key)=>
      <tr key={key}>
       <td>{data.ID}</td> 
       <td>{data.NAME}</td> 
       <td>{data.COURSE}</td> 
       <td>{data.ADDRESS}</td> 
       <td>{data.MOBILE}</td> 
       <td>
         <button onClick={()=>{this.handleDelete(data.ID)}}>Delete</button>
         <button onClick={()=>{this.handleUpdate(data)}}>Edit</button>
       </td> 
        </tr>
    )
  }
</table>

      </div>
      </div>
    </div>
  );
}
}

export default App


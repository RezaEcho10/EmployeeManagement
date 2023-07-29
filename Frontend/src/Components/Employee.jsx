import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Employee() {
  const [data, setData] = useState([])
  useEffect(() => {
    axios.get('http://localhost:8080/getEmployee')
    .then(res => {
      if(res.data.Status === "Success"){
        console.log(res.data.Result);
        setData(res.data.Result)
      }else{

      }
    })
    .catch(err => console.log(err))
  }, [])
  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Employee List</h3>
      </div>
      <Link to="/create" className='btn btn-success'>Add Employee</Link>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
              {
                data.map((employee, index) => {
                return <tr key={index}>
                    <td>{employee.name}</td>
                    <td>
                      {
                        <img src={`http://localhost:8080/images/`+employee.image} style={{width: '30px', height: '30px', borderRadius: '50px'}} />
                      }
                    </td>
                    <td>{employee.email}</td>
                    <td>{employee.address}</td>
                    <td>{employee.salary}</td>
                    <td>
                      <Link to={`/employeeEdit/`+employee.id} className='btn m-1 btn-primary btn-sm'>Edit</Link>
                      <button className='btn m-1 btn-sm btn-danger'>Delete</button>
                    </td>
                  </tr>
              })
              }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Employee
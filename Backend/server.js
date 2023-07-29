import express, { json } from 'express'
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'

const app = express()
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup'
})

con.connect(function(err){
    if(err){
        console.log('Error in Connection');
    }else{
        console.log("Connected");
    }
})

app.use('/login' , (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?"
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if(err) res.json({Status: 'Erorr' , Error: 'Error in Running Query'})
        if(result.length > 0){
            return res.json({Status: "Success"})
        }else{
            return res.json({Status: "Error", Error: "Wrong Email and Password"})
        }
    })
})

const storage = multer.diskStorage({
    destination: (req , res, cb) => {
        cb(null, 'public/images')
    },
    filename: (req , file, cb) => {
        cb(null , file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

app.use('/create' , upload.single('image'), (req , res) => {
    const sql = "INSERT INTO employee (`name`, `email`, `password`, `address`, `salary`, `image`) VALUES (?)"
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if(err) return res.json({Error: 'Error in hashing password'})
        const values = [
            req.body.name,
            req.body.email,
            req.body.password,
            req.body.address,
            req.body.salary,
            req.file.filename,
        ]
        con.query(sql , [values] , (err, result) => {
            if(err) return res.json({Error : 'Error inside Signup'})
            return res.json({Status: "Success"})
            console.log(result);
        })
    })
})

app.use('/getEmployee' , (req , res) => {
    const sql = "SELECT * FROM employee"
    con.query(sql , (err, result) => {
        if(err) return res.json({Error: 'Get Employee in sql'})
        return res.json({Status: 'Success' , Result: result})
    })
})

app.get('/:id', (req , res) => {
    const id = req.params.id
    const sql = "SELECT * FROM employee WHERE id = ?"
    con.query(sql , [id], (err, result) => {
        if(err) return res.json({Error: 'Get Employee in sql'})
        return res.json({Status: 'Success' , Result: result})
    })
})

app.put('/update/:id' , (req , res) => {
    const id = req.params.id
    const sql = "UPDATE employee set salary = ? WHERE id = ?"
    con.query(sql, [req.body.salary, id], (err, result) => {
        if(err) return res.json({Error: 'Update Employee Error in sql'})
        return res.json({Status: 'Success' , Result: result})
    })
})

app.listen(8080, () => {
    console.log("Server Connection");
})
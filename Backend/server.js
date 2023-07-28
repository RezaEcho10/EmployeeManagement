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
    const sql = "INSERT INTO employee (`name`, `email`, `password`, `image`) VALUES (?)"
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if(err) return res.json({Error: 'Error in hashing password'})
        const values = [
            req.body.name,
            req.body.email,
            req.body.password,
            req.file.filename
        ]
        con.query(sql , [values] , (err, result) => {
            if(err) return res.json({Error : 'Error inside Signup'})
            return res.json({Status: "Success"})
        })
    })
})

app.listen(8080, () => {
    console.log("Server Connection");
})
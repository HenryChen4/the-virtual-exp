//Dependencies
const express = require('express')
const hbs = require('hbs')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')

app.use(express.static(publicPath))
app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.get('', (req, res)=>{
    res.render('signup', {
        title: 'The Virtual Exp'
    })
})

app.get('/login', (req, res)=>{
    res.render('login', {
        title: 'The Virtual Exp'
    })
})

app.get('/home', (req, res)=>{
    res.send('asdf')
})

app.listen(port, ()=>{
    console.log('Server is up and running!')
})


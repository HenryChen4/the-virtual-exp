//Dependencies
const express = require('express')
const hbs = require('hbs')
const path = require('path')

const app = express()

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

app.listen(3000, ()=>{
    console.log('Server is up and running!')
})


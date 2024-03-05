const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const { Expense } = require('./schema.js')

const app = express()
app.use(bodyParser.json())
app.use(cors())
/**
 * git clone <link>
 * 
 * (add .gitignore file)
 * 
 * git add .
 * git commit -m "any msg"
 * git push origin main
 * 
 * git config --global user.name '<username>'
 * git config --global user.email <emailId>
 */

/**
 * Expense Tracker
 * 
 * Features and end points
 * 
 * Adding a new expense/income : /add-expense -> post
 * Displaying existing expenses : /get-expenses -> get
 * Editing existing entries : /edit-expense -> patch
 * Deleting expenses : /delete-expense -> delete
 * 
 * Budget reporting
 * Creating new user
 * Validating user
 * 
 * Defining schema
 * category, amount, date 
 */

async function connectToDb() {
    try {
        await mongoose.connect('mongodb+srv://kavinraje2022cse:admin123@cluster0.ssphf4t.mongodb.net/expensetracker?retryWrites=true&w=majority&appName=Cluster0')
        console.log('DB connection established :)')
        const port = process.env.PORT || 8000
        app.listen(port, function() {
            console.log(`Listening on port ${port}...`)
        })
    } catch(error) {
        console.log(error)
        console.log('Couldn\'t establish connection :(')
    }
}
connectToDb()

app.post('/add-expense', async function(request, response) {
    try {
        await Expense.create({
            "amount" : request.body.amount,
            "category" : request.body.category,
            "date" : request.body.date
        })
        response.status(201).json({
            "status" : "success",
            "message" : "entry created"
        })
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "entry not created",
            "error" : error
        })
    }
})

app.get('/get-expenses', async function(request, response) {
    try {
        const expensesData = await Expense.find()
        response.status(200).json(expensesData)
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not fetch entries",
            "error" : error
        })
    }
})

// localhost:8000/delete-expense/65e69afe69135ff2b81db62f
// localhost:8000/delete-expense/<params>
app.delete('/delete-expense/:id', async function(request, response) {
    try {
        const expenseEntry = await Expense.findById(request.params.id)
        if(expenseEntry) {
            await Expense.findByIdAndDelete(request.params.id)
            response.status(200).json({
                "status" : "success",
                "message" : "deleted entry"
            })
        } else {
            response.status(404).json({
                "status" : "failure",
                "message" : "could not find entry"
            })
        }
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not delete entry",
            "error" : error
        })
    }
})

/**
 * Using both request body and params
 * Sending the id via params, the details via request body
 */
app.patch('/edit-expense/:id', async function(request, response) {
    try {
        const expenseEntry = await Expense.findById(request.params.id)
        if(expenseEntry) {
            await expenseEntry.updateOne({
                "amount" : request.body.amount,
                "category" : request.body.category,
                "date" : request.body.date
            })
            response.status(200).json({
                "status" : "success",
                "message" : "updated entry"
            })
        } else {
            response.status(404).json({
                "status" : "failure",
                "message" : "could not find entry"
            })
        }
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not delete entry",
            "error" : error
        })
    }
})

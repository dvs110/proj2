import express from "express"
import mongoose from "mongoose"
import path from "path"
import dotenv from "dotenv"
dotenv.config();
import bcrypt from "bcryptjs";
import cors from "cors";
import { createError } from "./utils/error.js";
import Car from "./models/person.js"
const app = express()
app.use(cors());
const port = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: false }))

app.use(express.json());



const connect = async () => {
    try {
        await mongoose.connect(process.env.key);
        console.log("connected to mondodb");
    } catch (error) {
        throw error;
    }
}
mongoose.connection.on('disconnected', () => { //if mongodb got disconnected
    console.log("mongodb disconnected");
});


app.post('/form', async (req, res, next) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    console.log(req.body);
    const newperson = new Car(
        { ...req.body, password: hash }
    );
    try {
        const savedperson = await newperson.save();
        res.status(200).json(savedperson)

    } catch (err) {
        next(err)
    }
});

app.post("/verify", async (req, res, next) => {
    try {
        console.log(req.body);
        const person = await Car.findOne({ email: req.body.email })
        console.log(person);
        if (person == null) {
            res.status(200).json(1)
        } else {

            res.status(200).json(0)
        }


    } catch (err) {
        console.log(err);
        res.status(200).json("came")
        next(err)
    }

})

app.post("/signin", async (req, res, next) => {
    try {
        console.log(req.body);
        const person = await Car.findOne({ email: req.body.email })
        console.log(person);
        if (person == null) {
            res.status(200).json(0)
        } else {
            let isPasswordCorrect
            isPasswordCorrect = await bcrypt.compare(req.body.password, person.password);
            if (isPasswordCorrect) {
                res.status(200).json(person)
            }
            else
                res.status(200).json(0)
        }
    } catch (err) {
        console.log(err);
        res.status(200).json("error aa gaya")
        next(err)
    }

})

app.get("/:id", async (req, res, next) => {
    try {
        const person = await Car.findById(req.params.id);
        res.status(200).json(person)

    }
    catch (err) {
        console.log(err);
        res.status(200).json("error came")
        next(err)
    }
})

app.post("/pass/:id", async (req, res, next) => {
    try {
        const person = await Car.findById(req.params.id);

        if (person == null) {
            res.status(200).json(0)
        } else {
            let isPasswordCorrect
            isPasswordCorrect = await bcrypt.compare(req.body.password1, person.password);
            if (isPasswordCorrect) {
                res.status(200).json(person)
            }
            else
                res.status(200).json(0)
        }
    } catch (err) {
        console.log(err);
        res.status(200).json("error came")
        next(err)
    }

})
app.post("/updatepass/:id", async (req, res, next) => {
    try {
        const person = await Car.findById(req.params.id);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password2, salt);


        const updateperson = await Car.findByIdAndUpdate(person.id, { $set: { password: hash } }, { new: true });
        console.log(updateperson);
        if (updateperson)
            res.status(200).json(updateperson)
        else
            res.status(200).json(0)
    } catch (err) {
        console.log(err);
        res.status(200).json("error came")
        next(err)
    }

})
app.post("/find/:id", async (req, res, next) => {

    try {
        console.log(req.params.id);
        const person = await Car.findById(req.params.id);
        if (person)
            res.status(200).json(person)
        else
            res.json(0);
    } catch (err) {
        return next(err); //need to use return
    }
})



app.post("/update/:id", async (req, res, next) => {
    try {

        const updateperson = await Car.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { new: true });
        console.log(updateperson);
        res.status(200).json(updateperson)
    } catch (err) {
        return next(err);
    }

})



app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage
    });
})




app.listen(port, function (err) {

    connect();
    console.log("connect to backend");
})

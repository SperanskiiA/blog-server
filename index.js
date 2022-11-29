import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation } from './validations/validations.js';
import checkAuth from "./utils/checkAuth.js";
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js'

const mongoConnect = 'mongodb+srv://admin:qwerty123@cluster0.zcfiknu.mongodb.net/blog?retryWrites=true&w=majority'

mongoose.connect(mongoConnect).then(() => {
    console.log('db is ok')
}).catch((err) => {
    console.log('db err:' + err)
})

const app = express();
app.use(express.json())


app.post('/auth/register', registerValidation, UserController.register);

app.post('/auth/login', loginValidation, UserController.login);

app.get('/auth/me', checkAuth, UserController.getCredentials);

app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(4444, (err) => {
    if (err) {
        return console.log('somthing went wrong:' + err)
    } else {
        console.log('server is working on port: 4444')
    }
})

//continue from 1:50:20
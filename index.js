import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validations/validations.js';
import { PostController, UserController } from './controllers/index.js';
import { checkAuth, validationErrors } from './utils/index.js';

const mongoConnect =
  process.env.MONGODB_URI ||
  'mongodb+srv://admin:qwerty123@cluster0.zcfiknu.mongodb.net/blog?retryWrites=true&w=majority';

mongoose
  .connect(mongoConnect)
  .then(() => {
    console.log('db is ok');
  })
  .catch((err) => {
    console.log('db err:' + err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, 'uploads');
    } else if (file.fieldname === 'avatar') {
      cb(null, 'avatars');
    } else {
      console.log(file.fieldname);
      cb({ error: 'wrong fieldname!' });
    }
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/avatars', express.static('avatars'));

app.post(
  '/auth/register',
  registerValidation,
  validationErrors,
  UserController.register
);
app.post(
  '/auth/login',
  loginValidation,
  validationErrors,
  UserController.login
);
app.get('/auth/me', checkAuth, UserController.getCredentials);
app.get('/account/:id', checkAuth, PostController.getDataByUserId);
//upload images
app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post('/avatars', upload.single('avatar'), (req, res) => {
  console.log(req.file.originalname);
  res.json({
    url: `/avatars/${req.file.originalname}`,
  });
});

//coments routes
app.get('/comments', PostController.getComments);
app.get('/comments/:id', PostController.getCommById);
app.post('/posts/:id/comment', checkAuth, PostController.addComment);
app.get('/posts/:id/comments', PostController.getCommentsById);
app.delete('/comments/:id', checkAuth, PostController.removeComment);

//post routes
app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  validationErrors,
  PostController.create
);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  validationErrors,
  PostController.update
);
//tag routes
app.get('/tags', PostController.getLastTags);
app.get('/tags/:name', PostController.getPostsByTag);

app.get('/port', (req, res) => {
  res.json(process.env.PORT);
});

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log('somthing went wrong:' + err);
  } else {
    if (process.env.PORT) {
      console.log(`server is working on: ${process.env.PORT}`);
    }
    console.log('server is working on port: 4444');
  }
});

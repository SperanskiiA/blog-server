import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Email incorrect').isEmail(),
    body('password', 'Password should be at least 5 symbols').isLength({ min: 5, max: 16 }),
    body('fullName', 'Enter your name').isLength({ min: 3 }),
    body('avatarUrl', 'Incorrect URL').optional().isURL(),
]
export const loginValidation = [
    body('email', 'Email incorrect').isEmail(),
    body('password', 'Password should be at least 5 symbols').isLength({ min: 5, max: 16 }),

]
export const postCreateValidation = [
    body('title', 'Title cannot be empty').isLength({ min: 2 }).isString(),
    body('text', 'Text cannot be empty').isLength({ min: 10 }).isString(),
    body('tags', 'Incorrect tags format').optional().isString(),
    body('imageUrl', 'Incorrect url path').optional().isString(),

]
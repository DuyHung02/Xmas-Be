const validate = require('../utils/validator');
const {body} = require("express-validator");
const prisma = require("../database/connection")
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const isValid = await validate.run(req, res, [
            body('username')
                .trim()
                .exists()
                .notEmpty()
                .withMessage('Username cannot be empty'),
            body('password')
                .trim()
                .exists()
                .notEmpty()
                .withMessage('Password cannot be empty'),
        ]);

        if (!isValid) {
            console.log('not valid', isValid);
            return;
        }
        const {username, password} = req.body;
        const userExists = await prisma.user.findUnique({
            where: {username: username},
        });
        if (!userExists) {
            return res.status(404).send({error: 'username not found'});
        }
        console.log(userExists)
        const passwordMatched = () => {
            return userExists.password === password;
        }

        if (!passwordMatched()) {
            return res.status(422).send({error: 'Password incorrect'});
        }
        const secretKey = process.env.JWT_SECRET_KEY || 'xmas-merry-christmas'
        const token = jwt.sign(
            {
                userId: userExists.id,
                username: userExists.username,
                isAdmin: userExists.isAdmin,
            },
            secretKey,
            {
                expiresIn: '2h'
            },
        );

        return res.status(200).send({
            message: 'Login successful',
            userId: userExists.id,
            username: userExists.username,
            token: token,
            isAdmin: userExists.isAdmin,
            accountType: userExists.accountType,
            status: userExists.status,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({error: err.message});
    }
}

const getListUsers = async (req, res) => {
    try {
        const listUsers = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                profile: {
                    select: {
                        id: true,
                        email: true,
                        avatar: true,
                        gender: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            },
        });
        return res.status(200).send({
            message: 'get list users success',
            data: listUsers,
        });
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({error: err.message});
    }
}

module.exports = {
    login,
    getListUsers,
}
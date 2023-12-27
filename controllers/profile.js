const validate = require('../utils/validator')
const prisma = require('../database/connection')
const { param } = require("express-validator");

const getProfileByUserId = async (req, res) => {
    try {
        const isValid = await validate.run(req, res, [
            param('id').isNumeric().toInt().withMessage('id must not be empty'),
        ])

        if (!isValid) {
            return isValid;
        }
        const userId = req.params.id;
        const profile = await prisma.profile.findUnique({
            where: {userId: userId}
        })
        return res.status(200).send({ message: 'get profile success', data: {...profile} })
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ error: err.message });
    }
}

const createProfile = async (req, res) => {
    try {
        const isValid = await validate.run(req, res, [

        ])
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ error: err.message });
    }
}

module.exports = {
    getProfileByUserId,
}
const validate = require('../utils/validator')
const prisma = require('../database/connection')
const {body} = require("express-validator");

const getListConversations = async (req, res) => {
    try {
        const isValid = await validate.run(req, res, [
            body('userId')
                .notEmpty()
                .isNumeric()
                .withMessage('user id cannot be empty'),
        ])

        if (!isValid) {
            return isValid;
        }

        const {userId} = req.body;
        const conversations = await prisma.userConversation.findMany({
            where: {userId: userId},
            include: {
                conversation: {
                    include: {
                        messages: {
                            include: {
                                sender: {
                                    select: {
                                        id: true,
                                        profile: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).send({message: 'success', data: conversations})
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({error: err.message});
    }
}

const createMessage = async (req, res) => {
    try {
        const isValid = await validate.run(req, res, [
            body('senderId')
                .notEmpty()
                .isNumeric()
                .withMessage('sender id cannot be empty'),
            body('content')
                .notEmpty()
                .withMessage('content cannot be empty'),
            body('conversationId')
                .notEmpty()
                .isNumeric()
                .withMessage('conversation id cannot be empty')
        ])

        if (!isValid) {
            return isValid;
        }

        const { senderId, content, conversationId } = req.body;
        const data = {
            senderId: senderId,
            content: content,
            conversationId: conversationId,
        }
        const message = await prisma.message.create({
            data: data
        })

        const messageInfo = await prisma.message.findUnique({
            where: {id: message.id},
            include: {
                sender: {
                    select: {
                        id: true,
                        profile: true,
                    }
                }
            }
        })

        return res.status(200).send({
            message: 'create message success',
            data: messageInfo
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({error: err.message});
    }
}

module.exports = {
    getListConversations,
    createMessage,
}
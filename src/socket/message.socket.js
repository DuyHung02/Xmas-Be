const prisma = require('../database/connection')

const messageSocket = (socket) => {
    socket.on('SEND_MESSAGE', async (payload) => {
        try {
            const { conversationId } = payload
            socket.to(`CONVERSATION_${conversationId}`).emit(`NEW_MESSAGE_${conversationId}`, payload);
        } catch (err) {
            console.log(err.message)
        }
    })
}

module.exports = {
    messageSocket
}
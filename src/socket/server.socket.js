const {Server} = require('socket.io');
const {messageSocket} = require("./message.socket");

const configureSocket = (server) => {
    let io;
    if (!io) {
        io = new Server(server, {
            cors: {
                origin: 'http://localhost:3000',
                method: ['GET', 'POST']
            }
        });

        io.on('connection', (socket) => {
            console.log('a user connected');

            socket.on('JOIN_CONVERSATION', (conversationId) => {
                console.log('join id: ', conversationId)
                socket.join(`CONVERSATION_${conversationId}`);
            })

            // socket.on('SEND_MESSAGE', payload => {
            //     console.log('send success', payload)
            //     const { conversationId, messageId } = payload;
            //     io.to(`CONVERSATION_${conversationId}`).emit(`NEW_MESSAGE_${conversationId}`, payload);
            // })

            messageSocket(socket)

            socket.on('disconnect', () => {});
        })
    }
    return io;
}

module.exports = configureSocket;
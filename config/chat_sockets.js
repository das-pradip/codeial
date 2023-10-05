const { connect, connection } = require('mongoose');

module.exports.chatSockets = function(socketServer){
    // this is original code
    // let io = require('socket.io')(socketServer);

    // change
    const io = require('socket.io')(socketServer, {
        cors: {
            origin: 'http://localhost:8000', // Adjust the origin as needed
            methods: ['GET', 'POST'],
        },
    });
    

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });


        socket.on('join_room', function(data){
            console.log('joining request received', data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined', data);
        });

        // CHANGE :: detect send_message and broadcast to everyone in the room
        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });

    });
}
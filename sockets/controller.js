const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {
  socket.emit('ultimo-ticket', ticketControl.ultimo);
  socket.emit('estado-actual', ticketControl.ultimos4);
  socket.emit('tickets-pendientes', ticketControl.tickets.length);

  socket.on('siguiente-ticket', ( payload, callback ) => {
    const siguiente = ticketControl.siguiente();
    callback(siguiente);
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

    // TODO: notificar que hay un nuevo ticket pendiente de asignar
    // socket.emit('siguiente-ticket', siguiente);
    // socket.broadcast.emit('siguiente-ticket', payload );
  });

  socket.on('atender-ticket', ({ escritorio }, callback) => {
    // console.log(escritorio);
    if (!escritorio) {
      return callback({
        ok: false,
        msg: 'Es necesario un escritorio',
      });
    }

    const ticket = ticketControl.atenderTicket(escritorio);

    // TODO: notificar cambio en los ultimos4
    socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);
    if (!ticket) {
      return callback({
        ok: false,
        msg: 'No hay mas tickets',
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  })
}

module.exports = {
  socketController
}
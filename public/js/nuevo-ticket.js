// referencias HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const createBtn  = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
  createBtn.disabled = false;
});

socket.on('disconnect', () => {
  createBtn.disabled = true;
});

socket.on('ultimo-ticket', (id) => {
  // console.log('ultimo ticket ', payload);
  lblNuevoTicket.innerHTML = `Ticket ${id}`
});

createBtn.addEventListener('click', () => {

  socket.emit('siguiente-ticket', null, ( id ) => {
    // console.log('Desde el server', id );
    lblNuevoTicket.innerHTML = id
  });

});

// referencias HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblNumero = document.querySelector('small');
const lblAlert = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
  window.location = 'index.html';
  throw new Error('El escritorio es obligatorio')
}
// para saber el escritorio en el que me encuentro
const escritorio = searchParams.get('escritorio');
// console.log({ escritorio });
lblEscritorio.innerHTML = escritorio;
lblAlert.style.display = 'none';
// lblOffline.style.display = 'none';
// lblOnline.style.display  = '';

const socket = io();

socket.on('connect', () => {
  btnAtender.disabled = false;
});

socket.on('disconnect', () => {
  btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (payload) => {
  // console.log(payload);
  if ( payload == 0) {
    lblAlert.style.display = '';
    btnAtender.disabled = true;
  } else {
    lblAlert.style.display = 'none';
    btnAtender.disabled = false;

  }
  lblPendientes.innerText = payload;
});

btnAtender.addEventListener('click', () => {

  socket.emit('atender-ticket', { escritorio }, ({ ok, msg, ticket }) => {
    // console.log(ticket);
    if (!ok) {
      lblNumero.innerHTML = 'nadie.';
      return lblAlert.style.display = '';
    }
    lblNumero.innerText = 'Ticket '+ ticket.numero;
    // lblPendientes.innerText = left;
  });
  
});

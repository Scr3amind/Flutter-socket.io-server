const {io} = require('../index.js');
const Band = require('../models/band.js');

const Bands = require('../models/bands.js');
const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Metronomy'));
bands.addBand(new Band('New Order'));
bands.addBand(new Band('Linkin Park'));

console.log(bands);

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('Bandas-activas',bands.getBands());
    
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje',(payload) => {
        console.log('Mensaje!',payload);
        
        io.emit('mensaje',{admin: 'Nuevo Mensaje'});
    });
    
    client.on('vote-band',(payload) => {
        bands.voteBand(payload.id);
        io.emit('Bandas-activas', bands.getBands());
        
    });
    
    client.on('add-band',(payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('Bandas-activas', bands.getBands());
        
    });
    
    client.on('delete-band',(payload) => {
        bands.deleteBand(payload.id);
        io.emit('Bandas-activas', bands.getBands());
        
    });

    // client.on('emitir-mensaje',(payload) => {
    //     console.log('Mensaje!',payload);
        
    //     // io.emit('nuevo-mensaje',payload); // Emite a todos
    //     client.broadcast.emit('nuevo-mensaje', payload); // Todos menos el que emite
    // });
});
const express = require('express');
const clients = new Map(); 

const sseServer = express();

// Mapa de eventos registrados para los usuarios
const userEvents = new Map(); // Mapa para controlar qué usuario está escuchando qué evento

// Ruta para escuchar las conexiones SSE
sseServer.get('/events', (req, res) => {
    const userId = parseInt(req.query.user_id, 10);
    console.log(userId) // Suponiendo que estás extrayendo el userId de la sesión o JWT
    addClient(req, res, userId);
});

// Método para iniciar el servidor SSE en el puerto 3001
const startSSEServer = () => {
    const SSE_PORT = 3001;
    sseServer.listen(SSE_PORT, () => {
        console.log(`SSE Server running on port ${SSE_PORT}`);
    });

    // Llama a la función para emitir los eventos cada 5 segundos
    setInterval(emitAllEvents, 5000);
};

// Verifica si un cliente está conectado
const isClientConnected = (userId) => {
    return clients.has(userId);
};

// Agrega un cliente a la lista de conexiones activas
const addClient = (req, res, userId) => {
    if (!userId || typeof userId !== "number" && typeof userId !== "string") {
        console.error("Error: userId no válido");
        res.status(401).end();
        return;
    }

    if (clients.has(userId)) {
        console.log(`Usuario ${userId} ya está registrado en SSE`);
        res.write(`data: Ya estás conectado al SSE (userId: ${userId})\n\n`);
        return;
    }

    clients.set(userId, res);
    //console.log(`Usuario ${userId} conectado. Total clientes: ${clients.size}`);

    res.write(`data: Conectado al SSE (userId: ${userId})\n\n`);

    res.on("close", () => {
        clients.delete(userId);
        console.log(`Usuario ${userId} desconectado. Total clientes: ${clients.size}`);
        res.end();
    });
};

// Publica un evento a todos los usuarios conectados
const broadcast = (userId, data) => {
    const client = clients.get(userId);
    if (client) {
        console.log(`Enviando actualización a usuario ${userId}`);
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    } else {
        console.log(`Usuario ${userId} no tiene conexión SSE activa`);
    }
};

// Registra un evento para un usuario específico
const listenToEvent = (eventName, userId, data) => {
    // Verifica si el evento ya está registrado para el usuario
    if (!userEvents.has(userId)) {
        userEvents.set(userId, []);
    }
    console.log(`evento registrado: ${eventName}, user_id: ${userId} data: ${JSON.stringify(data)}`);  // Log para verificar si el evento está siendo registrado
    // Obtiene los eventos registrados de este usuario
    const eventsForUser = userEvents.get(userId);

    // Registramos el evento con los datos
    eventsForUser.push({ eventName, data });

    // Actualizamos el mapa con el evento registrado
    userEvents.set(userId, eventsForUser);
};

// Método para emitir un evento específico
const emitEvent = (eventName) => {
    // Recorremos el mapa de eventos por usuario
    userEvents.forEach((userEventsList, userId) => {
        userEventsList.forEach((event) => {
            if (event.eventName === eventName) {
                // Emitir evento a este usuario
                const client = clients.get(userId);
                if (client) {
                    console.log(`Enviando evento a usuario ${userId}: ${event.eventName}`);
                    client.write(`data: ${JSON.stringify(event.data)}\n\n`);
                }
            }
        });
    });
};

// Función para emitir todos los eventos registrados
const emitAllEvents = () => {
    console.log("Emitiendo todos los eventos...");  // Este es el paso clave
    userEvents.forEach((userEventsList, userId) => {
        console.log(`Verificando eventos para el usuario ${userId}`);  // Nuevo log
        if (userEventsList.length === 0) {
            console.log(`No hay eventos registrados para el usuario ${userId}`);
        }
        userEventsList.forEach((event) => {
            const client = clients.get(userId);
            if (client) {
                console.log(`Enviando evento a usuario ${userId}: ${event.eventName}`);
                client.write(`data: ${JSON.stringify(event.data)}\n\n`);
            }
        });
    });
};

// Función para emitir eventos a los usuarios registrados
const triggerEvent = (eventName, data) => {
    console.log(`Evento disparado: ${eventName} con datos: ${JSON.stringify(data)}`);
    listenToEvent(eventName, data.userId, data);
};

module.exports = {
    startSSEServer,
    isClientConnected,
    addClient,
    broadcast,
    listenToEvent,
    emitEvent,
    triggerEvent
};
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import express from "express";
import path from "path";
import { _bo_log_ } from "./_";

interface Connection {
    id: string;
    handshake: any;
    fullname: string;
    iduser: string | null;
    screen: string;
}

let connections: Connection[] = [];

export const initializeSocket = (server: http.Server) => {
    const corsOptions = {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    };

    const io = new SocketIOServer(server, {
        cors: corsOptions,
    });

    io.on('connection', (socket) => {
        _bo_log_('success', 'Un utilisateur connecté')
        
        connections.push({
            id: socket.id,
            handshake: socket.handshake,
            fullname: '',
            iduser: null,
            screen: '/dashbord'
        });
        
        
        io.emit('updateConnections', connections);
        
        // Gérer l'envoi des coordonnées par le conducteur
        socket.on('driverCoordinates', (data) => {
            const { rideId, coordinates } = data;
            // Transmettre les coordonnées aux autres utilisateurs
            io.emit(`ride_${rideId}_coordinates`, coordinates);
        });
        
        // >> get connexion 
        socket.on('getConnections', () => {
            socket.emit('updateConnections', connections);
        });
        
        
        // Gérer l'envoi des donnée
        socket.on('infos', (datas) => {
            const { id, data } = datas;
            // Transmettre les coordonnées aux autres utilisateurs
            io.emit(`info_${id}_get`, data);
        });
        
        // === Main
        socket.on('disconnect', () => {
            _bo_log_('error', 'Un utilisateur déconnecté')
            connections = connections.filter(conn => conn.id !== socket.id);
            io.emit('updateConnections', connections);
        });
        socket.on('coucou', (targetId) => {
            const targetSocket = io.sockets.sockets.get(targetId);
            if (targetSocket) {
                targetSocket.emit('coucou', 'coucou');
            }
        });
        socket.on('updateFullname', (fullname) => {
            const connIndex = connections.findIndex(conn => conn.id === socket.id);
            if (connIndex !== -1) {
                connections[connIndex].fullname = fullname;
                io.emit('updateConnections', connections);
            }
        });
        socket.on('updateIduser', (iduser) => {
            const connIndex = connections.findIndex(conn => conn.id === socket.id);
            if (connIndex !== -1) {
                connections[connIndex].iduser = iduser;
                io.emit('updateConnections', connections);
            }
        });
        socket.on('updateWindow', (screen) => {
            const connIndex = connections.findIndex(conn => conn.id === socket.id);
            if (connIndex !== -1) {
                connections[connIndex].screen = screen;
                io.emit('updateConnections', connections);
            }
        });
        socket.on('sendMessage', (messageData) => {
            io.emit('message', messageData);
        });
    });

    return io;
};


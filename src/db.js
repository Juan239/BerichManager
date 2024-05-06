import { createPool } from "mysql2/promise";
import { config } from "dotenv";

config();

export const pool = createPool({
    host: process.env.host,
    user:process.env.user,
    password : process.env.password,
    port: process.env.port,
    database: process.env.database
});

pool.getConnection()
    .then(connection => {
        console.log("Conexión a la base de datos establecida correctamente.");
        connection.release();
    })
    .catch(err => {
        console.error("Error al conectar a la base de datos: ", err);
    });


/*
    Esto es para conectarse a traves de docker
    export const pool = createPool({
    host: '192.168.1.100', // Reemplaza esto con la dirección IP de tu máquina
    user: 'root',
    password : '',
    port: 3306,
    database: 'daem'


    docker run --env-file=./.env -p 3001:3000 --network="host" apidaem:latest
}) */
"use strict";
const swaggerAutogen = require('swagger-autogen')();
//import swaggerAutogen from "swagger-autogen";
const outputFile = "./swagger.json";
const endpointsFiles = [
    "./src/*.ts",
    "./src/models/*.ts",
    "./src/routes/*.ts",
    "./src/middleware/*.ts",
    "./src/shared/*.ts",
];
const config = {
    info: {
        title: "Booking App API Documentation",
        description: "",
    },
    tags: [],
    host: "localhost:7000/api-docs",
    schemes: ["http", "https"],
    parameters: [],
};
swaggerAutogen(outputFile, endpointsFiles, config);

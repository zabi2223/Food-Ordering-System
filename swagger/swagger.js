import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Food Management API",
            version: "1.0.0",
            description: "API documentation for user and admin routes",
        },
        servers: [
            { url: "http://localhost:3000" }
        ]
    },
    apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);

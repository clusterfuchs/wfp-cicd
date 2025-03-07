"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Event_1 = __importDefault(require("./routes/Event"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TV Klosterneuburg Calendar',
            version: '1.0.0',
            description: 'API documentation for TV KLBG Calendar',
        },
    },
    apis: ['./src/routes/Event.ts'], // Path to the API routes
};
dotenv_1.default.config();
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const port = 3000;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send("Hello World!!");
});
app.use((0, cors_1.default)());
app.use('/events', Event_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
mongoose_1.default.connect((_a = process.env.MONGODB_URL) !== null && _a !== void 0 ? _a : '')
    .then(() => {
    app.listen(port, () => {
        console.log("Listening on Port " + port);
    });
})
    .catch(() => {
    console.log("Error!");
});

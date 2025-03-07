"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_1 = require("../models/event");
const router = express_1.default.Router();
/**
 * @swagger
 * paths:
 *   /events:
 *     get:
 *       tags:
 *         - Events
 *       summary: Get Events
 *       responses:
 *         '200':
 *           description: Successful response
 *         '500':
 *           description: Server error
 */
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield event_1.Event.find({});
        return res.status(200).json(events);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}));
/**
 * @swagger
 * paths:
 *   /events:
 *     post:
 *       tags:
 *         - Events
 *       summary: Create new Event
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 title: Turnvereinslager
 *                 start_date: '2024-08-10T15:56:51.407Z'
 *                 end_date: '2024-08-17T18:57:53.000Z'
 *                 color: 'event-green'
 *       responses:
 *         '201':
 *           description: Successful response
 *         '400':
 *           description: Missing required fields
 *         '500':
 *           description: Other error
 */
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        if (!req.body.title || !req.body.start_date || !req.body.end_date || !req.body.color) {
            return res.status(400).send({ message: "Missing required fields." });
        }
        const event = yield event_1.Event.create({
            "title": req.body.title,
            "start_date": new Date(req.body.start_date),
            "end_date": new Date(req.body.end_date),
            "color": req.body.color
        });
        return res.status(201).send(event);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}));
/**
 * @swagger
 * paths:
 *   '/events/{eventID}':
 *     patch:
 *       tags:
 *         - Events
 *       summary: Update Event
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 title: Turnvereinslager
 *                 start_date: '2024-08-10T15:56:51.407Z'
 *                 color: 'event-green'
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: eventID
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         '200':
 *           description: Successful response
 *         '404':
 *           description: Event not found
 *         '500':
 *           description: Server error
 */
router.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.id) {
            return res.send(404).send({ message: "Event not found." });
        }
        const id = req.params.id;
        const event = yield event_1.Event.findByIdAndUpdate(id, req.body);
        return res.status(200).send(event);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}));
/**
 * @swagger
 * paths:
 *   '/events/{eventID}':
 *     delete:
 *       tags:
 *         - Events
 *       summary: Delete Event
 *       parameters:
 *         - name: Event ID
 *           in: path
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         '200':
 *           description: Event deleted
 *         '404':
 *           description: Event not found
 *         '500':
 *           description: Server error
 */
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.id) {
            return res.status(40).send({ message: "Event not found." });
        }
        const id = req.params.id;
        const event = yield event_1.Event.findByIdAndDelete(id);
        return res.status(200).send({ message: "Successfully deleted" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}));
exports.default = router;

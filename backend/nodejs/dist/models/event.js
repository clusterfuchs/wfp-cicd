"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const EventSchema = new mongoose_1.Schema({
    title: {
        type: String, required: true, unique: true
    },
    start_date: {
        type: Date, required: true
    },
    end_date: {
        type: Date, required: true
    },
    color: {
        type: String, required: true
    }
}, {
    timestamps: true
});
exports.Event = (0, mongoose_1.model)('event', EventSchema);

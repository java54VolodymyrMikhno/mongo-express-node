import express from 'express';
export const accounts_route = express.Router();
import asyncHandler from 'express-async-handler';
import AccountsService from '../service/AccountsService.mjs';
import { validateParams } from '../middleware/validation.mjs';
import { schemaParams } from '../validation-schemas/schemas.mjs';
const accountsService = new AccountsService(process.env.MONGO_URI, process.env.DB_NAME);
accounts_route.post("/account", asyncHandler(async (req, res) => {
    const result = await accountsService.insertAccount(req.body);
    res.status(201).json(result);
}))
accounts_route.get("/:username", asyncHandler(async (req, res) => {
    const result = await accountsService.getAccount(req.params.username);
    res.status(200).json(result);
}))
accounts_route.put("/password",validateParams(schemaParams), asyncHandler(async (req, res) => {
    const result = await accountsService.updatePassword(req.body);
    res.status(200).json(result);
}))
accounts_route.delete("/:username", asyncHandler(async (req, res) => {
    const result = await accountsService.deleteAccount(req.params.username);
    res.status(200).json(result);
}))
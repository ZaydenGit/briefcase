import type { RequestHandler } from "express";

interface ListBody {}

export const listAll: RequestHandler<unknown, unknown, ListBody, unknown> = async (req, res, next) => {};
interface CreateBody {}

export const update: RequestHandler<unknown, unknown, UpdateBody, unknown> = async (req, res, next) => {};

export const remove: RequestHandler = async (req, res, next) => {};

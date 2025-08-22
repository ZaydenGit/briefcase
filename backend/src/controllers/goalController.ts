import type { RequestHandler } from "express";

interface ListBody {}

export const list: RequestHandler<unknown, unknown, ListBody, unknown> = async (req, res, next) => {};
interface CreateBody {}

export const create: RequestHandler<unknown, unknown, CreateBody, unknown> = async (req, res, next) => {};
interface UpdateBody {}

export const update: RequestHandler<unknown, unknown, UpdateBody, unknown> = async (req, res, next) => {};

interface ContributeBody {}

export const contribute: RequestHandler<unknown, unknown, ContributeBody, unknown> = async (req, res, next) => {};

export const remove: RequestHandler = async (req, res, next) => {};

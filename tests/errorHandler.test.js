import { describe, it, expect, vi, beforeEach } from 'vitest';
import errorHandler from '../apps/api/middlewares/errorHandler.js';

describe('errorHandler middleware', () => {
  let req, res, next;
  beforeEach(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    next = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('responds with 500 status', () => {
    errorHandler(new Error('boom'), req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('responds with error JSON body', () => {
    errorHandler(new Error('boom'), req, res, next);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error on server side' });
  });

  it('logs the error', () => {
    errorHandler(new Error('oops'), req, res, next);
    expect(console.error).toHaveBeenCalled();
  });
});

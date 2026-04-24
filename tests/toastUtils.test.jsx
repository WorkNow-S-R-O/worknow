import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('react-hot-toast', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

import { toast } from 'react-hot-toast';
import { showToastError, showToastSuccess } from '../apps/api/utils/toastUtils.jsx';

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('showToastError', () => {
  it('calls toast.error for upgradeRequired error', () => {
    const error = { response: { data: { upgradeRequired: true, error: 'Лимит вакансий' } } };
    showToastError(error);
    expect(toast.error).toHaveBeenCalled();
  });

  it('calls toast.error with server error message', () => {
    const error = { response: { data: { error: 'Ошибка сервера' } } };
    showToastError(error);
    expect(toast.error).toHaveBeenCalledWith('Ошибка сервера');
  });

  it('calls toast.error with default message when no response', () => {
    const error = { message: 'network error' };
    showToastError(error);
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Ошибка'));
  });
});

describe('showToastSuccess', () => {
  it('calls toast.success with message', () => {
    showToastSuccess('Готово!');
    expect(toast.success).toHaveBeenCalledWith('Готово!');
  });
});

import { describe, expect, it } from 'vitest';
import { ApiRequestError } from '@/lib/api';
import { describeAccountError } from './error-messages';

const api = (code: string) => new ApiRequestError({ statusCode: 400, code, message: 'x' });

describe('describeAccountError', () => {
  it.each([
    ['CONTACT_EMAIL_NOT_SET', 'contactEmail'],
    ['CONTACT_EMAIL_VERIFICATION_CODE_INVALID', 'code'],
    ['CONTACT_EMAIL_VERIFICATION_CODE_EXPIRED', 'code'],
    ['CONTACT_EMAIL_ALREADY_VERIFIED', null],
  ])('maps %s to its field', (code, field) => {
    expect(describeAccountError(api(code)).field).toBe(field);
  });

  it('falls back to the general messages', () => {
    expect(describeAccountError(api('INVALID_PASSWORD')).field).toBe('currentPassword');
    expect(describeAccountError(new Error('x')).field).toBeNull();
  });
});

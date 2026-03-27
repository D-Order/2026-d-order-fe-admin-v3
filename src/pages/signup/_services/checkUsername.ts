/**
 * 아이디 중복 체크
 * GET /api/v3/django/auth/check?username={username}
 * 인증 불필요. 응답: 200 OK, data.is_available (true: 사용 가능, false: 중복)
 */
import { instance } from '@services/instance';

export type CheckUsernameResponse = {
  message: string;
  data: { is_available: boolean };
};

export async function checkUsername(username: string): Promise<boolean> {
  const res = await instance.get<CheckUsernameResponse>(
    '/api/v3/django/auth/check-username',
    { params: { username } },
  );
  return res.data?.data?.is_available ?? false;
}

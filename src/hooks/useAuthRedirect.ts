import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@constants/routeConstants';

/**
 * 보호된 라우트에서 사용.
 * 로그인/회원가입 시 localStorage에 넣는 Booth-ID 유무로 구분.
 * 없으면 초기 화면으로 보냄. (HttpOnly 쿠키만 쓸 때 토큰은 읽을 수 없음)
 */
const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const boothId =
      localStorage.getItem('Booth-ID') ?? localStorage.getItem('boothId');
    if (!boothId) {
      navigate(ROUTE_PATHS.INIT);
    }
  }, [navigate]);
};

export default useAuthRedirect;

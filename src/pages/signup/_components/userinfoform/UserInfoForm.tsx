import * as S from './UserInfoForm.styled';
import { instance } from '@services/instance';
import { useState, useEffect, useCallback } from 'react';
import CommonInput from '../inputs/CommonInput';
import NextButton from '../buttons/NextButton';

const isValidIdFormat = (id: string) => /^[a-z0-9]{6,12}$/.test(id);
const isValidPasswordFormat = (pw: string) =>
  /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]{4,20}$/.test(pw);

const checkDuplicateId = async (id: string): Promise<boolean> => {
  const response = await instance.get('/api/v2/manager/check/', {
    params: { username: id },
  });
  return response.data?.data?.is_available;
};

/** Storybook용: 설정 시 API 대신 해당 결과로 중복 확인 메시지 표시 */
export type MockDuplicateCheck = 'success' | 'duplicate' | 'error';

type Props = {
  formData: {
    userId: string;
    password: string;
    confirmPassword: string;
  };
  onChange: (key: keyof Props['formData'], value: string) => void;
  onNext: () => void;
  userStage: number;
  setUserStage: React.Dispatch<React.SetStateAction<number>>;
  /** Storybook용: 중복 확인 성공/실패/오류 분기 */
  mockDuplicateCheck?: MockDuplicateCheck;
};

const UserInfoForm = ({
  formData,
  onChange,
  onNext,
  userStage,
  setUserStage,
  mockDuplicateCheck,
}: Props) => {
  const { userId, password, confirmPassword } = formData;

  // 메시지 상태
  const [idError, setIdError] = useState<string | null>(null);
  const [idSuccess, setIdSuccess] = useState<string | null>(null);

  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  const [confirmPwError, setConfirmPwError] = useState<string | null>(null);
  const [confirmPwSuccess, setConfirmPwSuccess] = useState<string | null>(null);

  // --- 1) 아이디: 즉시 형식검사 + 디바운스 중복검사 ---
  useEffect(() => {
    // 매 입력마다 초기화
    setIdError(null);
    setIdSuccess(null);

    if (!userId) return; // 빈값이면 아무 메시지 X

    if (!isValidIdFormat(userId)) {
      setIdError('6~12자 이내의 영문 소문자, 숫자를 입력해 주세요.');
      return;
    }

    // 형식 OK이면 디바운스로 서버중복검사 (또는 Storybook 목업)
    const timer = setTimeout(async () => {
      if (mockDuplicateCheck !== undefined) {
        if (mockDuplicateCheck === 'success') setIdSuccess('사용 가능한 아이디예요.');
        else if (mockDuplicateCheck === 'duplicate') setIdError('이미 존재하는 아이디예요.');
        else setIdError('중복 확인 중 오류가 발생했습니다.');
        return;
      }
      try {
        const available = await checkDuplicateId(userId);
        if (available) setIdSuccess('사용 가능한 아이디예요.');
        else setIdError('이미 존재하는 아이디예요.');
      } catch {
        setIdError('중복 확인 중 오류가 발생했습니다.');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [userId, mockDuplicateCheck]);

  // --- 2) 비밀번호: 즉시 형식검사 ---
  useEffect(() => {
    setPwError(null);
    setPwSuccess(null);

    if (!password) return;
    if (!isValidPasswordFormat(password)) {
      setPwError('4~20자 이내의 영문, 숫자, 특수문자를 입력해 주세요.');
      return;
    }
    setPwSuccess('사용 가능한 비밀번호예요.');
  }, [password]);

  // --- 3) 비밀번호 확인: 즉시 일치검사 ---
  useEffect(() => {
    setConfirmPwError(null);
    setConfirmPwSuccess(null);

    if (!confirmPassword) return;
    if (password !== confirmPassword) {
      setConfirmPwError('비밀번호가 일치하지 않아요.');
      return;
    }
    setConfirmPwSuccess('비밀번호가 일치해요.');
  }, [password, confirmPassword]);

  // 단계 전환 시, 다음 단계 입력에 대한 메시지만 유지하도록(기존 로직 유지)
  useEffect(() => {
    setConfirmPwError(null);
    setConfirmPwSuccess(null);
  }, [userStage]);

  // 현재 단계 유효 여부
  const isIdValid = !!idSuccess && !idError;
  const isPwValid = !!pwSuccess && !pwError;
  const isConfirmValid = !!confirmPwSuccess && !confirmPwError;

  const isValid =
    (userStage === 1 && isIdValid) ||
    (userStage === 2 && isPwValid) ||
    (userStage === 3 && isConfirmValid);

  const handleNextStep = useCallback(() => {
    if (userStage === 1) {
      if (!isIdValid) return;
      setUserStage(2);
      setIdSuccess(null);
    } else if (userStage === 2) {
      if (!isPwValid) return;
      setUserStage(3);
      setPwSuccess(null);
    } else if (userStage === 3) {
      if (!isConfirmValid) return;
      onNext();
    }
  }, [userStage, setUserStage, onNext, isIdValid, isPwValid, isConfirmValid]);

  return (
    <S.Wrapper>
      <CommonInput
        label="아이디"
        placeholder="예) dorder2025"
        value={userId}
        onChange={(e) => onChange('userId', e.target.value)}
        // onKeyDown 제거: 즉시검증으로 대체
        error={idError ?? undefined}
        success={idSuccess ?? undefined}
        helperText="6~12자 이내의 영문 소문자, 숫자를 입력해 주세요."
        onClear={() => {
          onChange('userId', '');
          setIdError(null);
          setIdSuccess(null);
        }}
        onResetValidation={() => {
          setIdError(null);
          setIdSuccess(null);
        }}
        isVisible={userStage >= 1}
        disabled={userStage !== 1}
      />

      <CommonInput
        label="비밀번호"
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={(e) => onChange('password', e.target.value)}
        error={pwError ?? undefined}
        success={pwSuccess ?? undefined}
        helperText="4~20자 이내의 영문, 숫자, 특수문자를 입력해 주세요."
        onClear={() => {
          onChange('password', '');
          setPwError(null);
          setPwSuccess(null);
        }}
        onResetValidation={() => {
          setPwError(null);
          setPwSuccess(null);
        }}
        isVisible={userStage >= 2}
        disabled={userStage !== 2}
      />

      <CommonInput
        label="비밀번호 확인"
        placeholder="비밀번호 확인"
        type="password"
        value={confirmPassword}
        onChange={(e) => onChange('confirmPassword', e.target.value)}
        error={confirmPwError ?? undefined}
        success={confirmPwSuccess ?? undefined}
        helperText="비밀번호를 동일하게 입력해 주세요."
        onClear={() => {
          onChange('confirmPassword', '');
          setConfirmPwError(null);
          setConfirmPwSuccess(null);
        }}
        onResetValidation={() => {
          setConfirmPwError(null);
          setConfirmPwSuccess(null);
        }}
        isVisible={userStage >= 3}
        forceShowPasswordWhenSuccess
        disabled={userStage !== 3}
      />

      <NextButton onClick={handleNextStep} disabled={!isValid}>
        다음
      </NextButton>
    </S.Wrapper>
  );
};

export default UserInfoForm;

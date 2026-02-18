import * as S from './SignupPage.styled';
import { SIGNUP_CONSTANTS } from './_constants/signupConstants';
import UserInfoForm from './_components/userinfoform/UserInfoForm';
import PubInfoForm from './_components/pubinfoform/PubInfoForm';
import PaymentInfoForm from './_components/paymentinfoform/PaymentInfoForm';

import { useSignupPage, Step } from './_hooks/useSignupPage';

export type SignupPageProps = {
  /** Storybook용: 처음 보여줄 단계 */
  initialStep?: Step;
  /** Storybook용: 1단계 아이디 중복 확인 결과 (성공/실패/오류) */
  mockDuplicateCheck?: 'success' | 'duplicate' | 'error';
  /** Storybook용: 최종 회원가입 제출 결과 (성공/실패) */
  mockSignupSubmit?: 'success' | 'fail';
};

const SignupPage = (
  { initialStep, mockDuplicateCheck, mockSignupSubmit }: SignupPageProps = {}
) => {
  const { step, goBack, stepProps } = useSignupPage(
    initialStep,
    mockDuplicateCheck,
    mockSignupSubmit
  );

  const renderStepComponent = () => {
    switch (step) {
      case Step.USER:
        return <UserInfoForm {...stepProps} />;
      case Step.PUB:
        return <PubInfoForm {...stepProps} />;
      case Step.PAYMENT:
        return <PaymentInfoForm {...stepProps} />;
      default:
        return null;
    }
  };

  const getTitleText = () => {
    switch (step) {
      case Step.USER:
        return { title: '회원 정보 입력', semiTitle: '(1/3)' };
      case Step.PUB:
        return { title: '주점 정보 입력', semiTitle: '(2/3)' };
      case Step.PAYMENT:
        return { title: '결제 정보 입력', semiTitle: '(3/3)' };
      default:
        return { title: '', semiTitle: '' };
    }
  };

  const { title, semiTitle } = getTitleText();

  return (
    <S.Wrapper>
      <S.BackIMG src={SIGNUP_CONSTANTS.IMAGES.BACKWARD} onClick={goBack} />
      <S.Container>
        <S.ImageBox>
          <S.Image src={SIGNUP_CONSTANTS.IMAGES.LOGO} />
          <S.Image2 src={SIGNUP_CONSTANTS.IMAGES.CHARACTER} />
        </S.ImageBox>
      </S.Container>
      <S.Container2>
        <S.TitleBox>
          <S.Title>{title}</S.Title>
          <S.SemiTitle>{semiTitle}</S.SemiTitle>
        </S.TitleBox>
        {renderStepComponent()}
      </S.Container2>
    </S.Wrapper>
  );
};

export default SignupPage;

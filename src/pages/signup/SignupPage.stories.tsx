import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import SignupPage, { type SignupPageProps } from './SignupPage';

const meta = {
  title: 'Pages/SignupPage',
  component: SignupPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    mockDuplicateCheck: {
      control: 'radio',
      options: [undefined, 'success', 'duplicate', 'error'],
      labels: {
        undefined: '실제 API',
        success: '중복 확인 성공',
        duplicate: '중복 확인 실패 (이미 존재)',
        error: '중복 확인 오류',
      },
    },
    mockSignupSubmit: {
      control: 'radio',
      options: [undefined, 'success', 'fail'],
      labels: {
        undefined: '실제 API',
        success: '회원가입 성공(목업)',
        fail: '회원가입 실패(목업)',
      },
    },
  },
  decorators: [
    (Story: () => React.ReactElement) => (
      <MemoryRouter initialEntries={['/signup']}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof SignupPage>;

export default meta;
type Story = StoryObj<typeof meta> & { args?: Partial<SignupPageProps> };

/** 1단계부터 순서대로 진행 (실제 API 사용) */
export const Default: Story = {};

/** 아이디 중복 확인 성공: "사용 가능한 아이디예요." 표시 */
export const 중복확인성공: Story = {
  args: { mockDuplicateCheck: 'success' },
};

/** 아이디 중복 확인 실패: "이미 존재하는 아이디예요." 표시 */
export const 중복확인실패: Story = {
  args: { mockDuplicateCheck: 'duplicate' },
};

/** 중복 확인 성공 이후 회원가입 성공 분기(목업): 3단계에서 회원가입 클릭 시 완료 모달 표시 */
export const 회원가입성공: Story = {
  args: { mockDuplicateCheck: 'success', mockSignupSubmit: 'success' },
};

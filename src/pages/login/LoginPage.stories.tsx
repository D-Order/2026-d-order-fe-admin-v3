import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

const meta = {
  title: 'Pages/LoginPage',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    mockLogin: {
      control: 'radio',
      options: [undefined, 'success', 'error'],
      labels: { undefined: '실제 API', success: '성공 분기 (목업)', error: '실패 분기 (목업)' },
    },
  },
  decorators: [
    (Story: () => React.ReactElement) => (
      <MemoryRouter initialEntries={['/login']}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 실제 API 호출 (백엔드 필요) */
export const Default: Story = {};

/** 로그인 성공 분기: 아이디/비밀번호 입력 후 로그인 클릭 시 홈으로 이동 */
export const MockSuccess: Story = {
  args: { mockLogin: 'success' },
};

/** 로그인 실패 분기: 로그인 클릭 시 실패 알림 */
export const MockError: Story = {
  args: { mockLogin: 'error' },
};

import type { Preview } from '@storybook/react-vite';
import React from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import theme from '../src/styles/theme';
import GlobalStyle from '../src/styles/global';

const StoryBackground = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.Orange02};
  box-sizing: border-box;
`;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <StoryBackground>
          <Story />
        </StoryBackground>
      </ThemeProvider>
    ),
  ],
};

export default preview;

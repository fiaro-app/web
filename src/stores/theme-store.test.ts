import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_PRIMARY_COLOR, useThemeStore } from './theme-store';

beforeEach(() => {
  useThemeStore.setState({ primaryColor: DEFAULT_PRIMARY_COLOR });
  document.documentElement.style.cssText = '';
});

describe('useThemeStore', () => {
  it('starts with the default brand color', () => {
    expect(useThemeStore.getState().primaryColor).toBe(DEFAULT_PRIMARY_COLOR);
  });

  it('setPrimaryColor updates the state and the CSS variables, including a derived hover shade', () => {
    useThemeStore.getState().setPrimaryColor('#ff0000');

    expect(useThemeStore.getState().primaryColor).toBe('#ff0000');
    const root = document.documentElement.style;
    expect(root.getPropertyValue('--primary')).toBe('#ff0000');
    expect(root.getPropertyValue('--ring')).toBe('#ff0000');
    expect(root.getPropertyValue('--primary-hover')).not.toBe('');
    expect(root.getPropertyValue('--primary-hover')).not.toBe('#ff0000');
  });

  it('resetPrimaryColor restores the default', () => {
    useThemeStore.getState().setPrimaryColor('#ff0000');

    useThemeStore.getState().resetPrimaryColor();

    expect(useThemeStore.getState().primaryColor).toBe(DEFAULT_PRIMARY_COLOR);
    expect(document.documentElement.style.getPropertyValue('--primary')).toBe(
      DEFAULT_PRIMARY_COLOR,
    );
  });
});

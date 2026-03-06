import { useThemeStore } from '../../src/store/themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: 'dark' });
  });

  it('has dark mode as initial state', () => {
    expect(useThemeStore.getState().mode).toBe('dark');
  });

  it('toggleTheme switches dark to light', () => {
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().mode).toBe('light');
  });

  it('toggleTheme twice switches back to dark', () => {
    useThemeStore.getState().toggleTheme();
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().mode).toBe('dark');
  });

  it('isDark returns true when mode is dark', () => {
    expect(useThemeStore.getState().isDark()).toBe(true);
  });

  it('isDark returns false when mode is light', () => {
    useThemeStore.setState({ mode: 'light' });
    expect(useThemeStore.getState().isDark()).toBe(false);
  });

  it('setMode sets the mode directly', () => {
    useThemeStore.getState().setMode('light');
    expect(useThemeStore.getState().mode).toBe('light');
  });

  it('toggle and toggleTheme behave the same', () => {
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().mode).toBe('light');

    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().mode).toBe('dark');
  });

  it('colors returns theme-appropriate colors', () => {
    const darkColors = useThemeStore.getState().colors();
    expect(darkColors.bg).toBeDefined();

    useThemeStore.setState({ mode: 'light' });
    const lightColors = useThemeStore.getState().colors();
    expect(lightColors.bg).toBeDefined();
    expect(lightColors.bg).not.toBe(darkColors.bg);
  });
});

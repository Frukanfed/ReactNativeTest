import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { lightTheme, darkTheme } from '../constants/Themes';

export const useThemeColors = () => {
    const mode = useSelector((state: RootState) => state.theme.mode);
    return mode === 'dark' ? darkTheme : lightTheme;
};
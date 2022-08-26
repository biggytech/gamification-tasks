import COLORS from '../config/colors';
import { IColorsProvider } from '../lib/types';

const appColorsProvider: IColorsProvider = {
  error: COLORS.error,
  warning: COLORS.warning,
  lightSuccess: COLORS.lightSuccess,
  success: COLORS.success,
  neutral: COLORS.neutral,
  lightNeutral: COLORS.lightNeutral,
};

export default appColorsProvider;

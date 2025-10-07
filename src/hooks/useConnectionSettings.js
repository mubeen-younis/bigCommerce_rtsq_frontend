import { useSelector, useDispatch } from 'react-redux';
import { postData, installCarrierAndSaveSettings } from '../Actions/Action';

export const useConnectionSettings = () => {
  const dispatch = useDispatch();
  const { token, isInstalling, availableCarrierId } = useSelector(state => state);

  const submitConnectionSettings = (values, originalPostData) => {
    // If we're in install mode and not testing, use nickname-based installation
    if (isInstalling && !values.testType && availableCarrierId) {
      console.log('🔍 NICKNAME DEBUG: Installing carrier with nickname:', values.nickname);
      return dispatch(installCarrierAndSaveSettings(values, token, availableCarrierId));
    } else if (isInstalling && !values.testType && values.nickname) {
      console.log('🔍 NICKNAME DEBUG: Installing carrier with nickname (fallback):', values.nickname);
      return dispatch(installCarrierAndSaveSettings(values, token, values.carrierId));
    } else {
      // Normal flow for test connection or existing carriers
      return originalPostData(values, token);
    }
  };

  return { submitConnectionSettings };
};
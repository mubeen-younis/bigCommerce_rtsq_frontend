import { useSelector, useDispatch } from 'react-redux';
import { postData, installCarrierAndSaveSettings } from '../Actions/Action';

export const useConnectionSettings = () => {
  const dispatch = useDispatch();
  const { token, isInstalling, availableCarrierId } = useSelector(state => state);

  const submitConnectionSettings = (values, originalPostData) => {
    console.log('🔍 DEBUG HOOK: submitConnectionSettings called with:', {
      isInstalling,
      testType: values.testType,
      availableCarrierId,
      nickname: values.nickname,
      carrierId: values.carrierId
    });

    // If we're in install mode and not testing, use nickname-based installation
    if (isInstalling && !values.testType && availableCarrierId) {
      console.log('🔍 DEBUG HOOK: Using nickname-based installation flow with availableCarrierId');
      return dispatch(installCarrierAndSaveSettings(values, token, availableCarrierId));
    } else if (isInstalling && !values.testType && values.nickname) {
      console.log('🔍 DEBUG HOOK: Using nickname-based installation flow (fallback with nickname)');
      return dispatch(installCarrierAndSaveSettings(values, token, values.carrierId));
    } else {
      console.log('🔍 DEBUG HOOK: Using normal connection settings flow');
      // Normal flow for test connection or existing carriers
      return originalPostData(values, token);
    }
  };

  return { submitConnectionSettings };
};
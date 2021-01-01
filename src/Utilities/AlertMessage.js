import React, {useEffect} from "react";
import { connect } from "react-redux";
import { dismissAlert } from "../Actions/Action";
import { Alert } from 'antd';

function AlertMessage(props) {
    
    const dismissAlert = () => {
        props.dismissAlert()
    }
        return (
            <>
              {props.showAlertMessage ?
              <Alert
              message={props.alertMessageType}
              description={props.alertMessage}
              type={props.alertMessageType}
              closable
              showIcon
              onClose={dismissAlert}
            />
              : null  }
            </>
        )    
    
    
}

const mapStateToProps = (state) => {
    return {
        alertMessage: state.alertMessage,
        alertMessageType: state.alertMessageType,
        showAlertMessage: state.showAlertMessage
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
        dismissAlert: () => dispatch(dismissAlert()),
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(AlertMessage);
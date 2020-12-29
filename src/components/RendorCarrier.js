import React, {useEffect} from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import TabsLayout from '../tabs_layout/tabs';
import { getCarrierDetails } from "../Actions/Action";

function RendorCarrier(props) {
    const carrierId = useParams().carrierId
    useEffect(()=> {
        if (carrierId !== undefined) {
            const data = {
                carrierId: carrierId,
                shop: 'dev-azm-1.myshopify.com'
            }
            props.getCarrierDetails(data)
        }
    })
    return (
        <>
          <TabsLayout />
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      getCarrierDetails: () => dispatch(getCarrierDetails()),
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(RendorCarrier);
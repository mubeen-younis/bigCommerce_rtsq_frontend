import React, {Fragment, useState} from 'react';
import { Row, Col, Button, Typography, Card } from 'antd';
import { Link } from "react-router-dom";  
import { connect } from "react-redux";
const { Title } = Typography;
const { Meta } = Card;

function ShippingCarriersComponent(props){

    const [shippingCarriersState, setShippingCarriersState] = useState({
        installedCarriers: null,
        enitureCarriers: null
    })

    const getInstalledCarriers = () => {
        props.installedCarriers.map((value, index) => {
            return <Col className="gutter-row mb-3" xs={24} sm={24} md={12} lg={12} xl={6}>
                    <Card className={"card-custom"} 
                    style={{ width: '100%' }}
                    >
                        <div className={"card-inner"}>
                            <figure><img style={{ height: '70px' }} src={`../../images/${value.logo}`} alt={`logo`} /></figure>
                            <Meta title={value.name} description="" />                              
                            <Button className={"mt-3"} type="primary" onClick={() =>  changeCarrierStatus(value.id, value.is_enabled)}>{value.is_enabled === 1 ? 'Disable' : 'Enable'}</Button>
                        </div>
                    </Card>
                </Col>
        })
    }

    const getEnitureCarriers = () => {
        props.enitureCarriers.map((value, index) => {
            return <Col className="gutter-row mb-3" xs={24} sm={24} md={12} lg={12} xl={6}>
                    <Card className={"card-custom"} 
                    style={{ width: '100%' }}
                    >
                        <div className={"card-inner"}>
                            <figure><img style={{ height: '70px' }} src={`../../images/${value.logo}`} alt={"text alt"} /></figure>
                            <Meta title={value.name} description="" />                              
                            <Button className={"mt-3"} type="primary" onClick={() =>  installCarrier(value.id)}>Install</Button>
                        </div>
                    </Card>
                </Col>
        })
    }

    const installCarrier = (carrierId) => {

    }

    const changeCarrierStatus = (carrierId, status) => {

    }

    return(
        <Fragment>
            <Row gutter={25}>
                <Col className="gutter-row mb-3" xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Title level={3} style={{ textAlign: 'center' }}>Wellcome to Eniture Shipping</Title>
                </Col>
            </Row>
            <Row gutter={25}>
                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Title level={4}>Installed Carriers</Title>
                </Col>
                {(props.installedCarriers !== undefined) ? shippingCarriersState.installedCarriers : 'No carrier installed' }
                
            </Row>
            <Row gutter={25}>
                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Title level={4}>Recommended Carriers</Title>
                </Col>
                
                {(props.enitureCarriers !== undefined) ? shippingCarriersState.enitureCarriers : 'No carrier Found' }
                
            </Row>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        installedCarriers: state.installedCarriers,
        enitureCarriers: state.enitureCarriers
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(ShippingCarriersComponent);
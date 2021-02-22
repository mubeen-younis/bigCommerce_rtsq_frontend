import React, { Fragment, useEffect } from 'react';
import { Row, Col, Button, Typography, Card } from 'antd';
import { connect } from 'react-redux';
import {
	getInstalledCarriers,
	changeCarrierStatus,
	changeAddonStatus,
	getInstalledAddons,
} from '../../Actions/EnitureStore';
const { Title } = Typography;
const { Meta } = Card;

function ShippingCarriersComponent(props) {
	// const [shippingCarriersState, setShippingCarriersState] = useState({
	//     installedCarriers: null,
	//     enitureCarriers: null
	// })

	useEffect(() => {
		if (
			props.installedCarriers === null ||
			props.installedCarriers === undefined
		) {
			props.getInstalledCarriers(props.token);
		}
		if (props.installedAddons === null || props.installedAddons === undefined) {
			props.getInstalledAddons(props.token);
		}
	}, [props]);

	const getInstalledCarriers = () => {
		return props.installedCarriers.map((value, key) => {
			return (
				<Col
					className='gutter-row mb-3'
					xs={24}
					sm={24}
					md={12}
					lg={12}
					xl={6}
					key={key}
				>
					<Card className={'card-custom'} style={{ width: '100%' }}>
						<div className={'card-inner'}>
							<figure>
								<img
									style={{ height: '70px' }}
									src={`../../images/${value.logo}`}
									alt={`logo`}
								/>
							</figure>
							<Meta title={value.name} description='' />
							<Button
								className={'mt-3'}
								type='primary'
								onClick={() =>
									props.changeCarrierStatus(value.carrier_id, props.token)
								}
							>
								{value.is_enabled === 1 ? 'Disable' : 'Enable'}
							</Button>
						</div>
					</Card>
				</Col>
			);
		});
	};
	const getInstalledAddons = () => {
		return props.installedAddons.map((value, key) => {
			return (
				<Col
					className='gutter-row mb-3'
					xs={24}
					sm={24}
					md={12}
					lg={12}
					xl={6}
					key={key}
				>
					<Card className={'card-custom'} style={{ width: '100%' }}>
						<div className={'card-inner'}>
							<Meta title={value.name} description='' />
							<Button
								className={'mt-3'}
								type='primary'
								onClick={() => props.changeAddonStatus(value.id, props.token)}
							>
								{value.is_enabled === 1 ? 'Disable' : 'Enable'}
							</Button>
						</div>
					</Card>
				</Col>
			);
		});
	};
	const getEnitureCarriers = () => {
		return props.carriers.map((value, key) => {
			return (
				<Col
					className='gutter-row mb-3'
					xs={24}
					sm={24}
					md={12}
					lg={12}
					xl={6}
					key={key}
				>
					<Card className={'card-custom'} style={{ width: '100%' }}>
						<div className={'card-inner'}>
							<figure>
								<img
									style={{ height: '70px' }}
									src={`../../images/${value.logo}`}
									alt={'text alt'}
								/>
							</figure>
							<Meta title={value.name} description='' />
							<Button
								className={'mt-3'}
								type='primary'
								onClick={() => installCarrier(value.id)}
							>
								Install
							</Button>
						</div>
					</Card>
				</Col>
			);
		});
	};

	const getRecommendedAddons = () => {
		return props.addons.map((value, key) => {
			return (
				<Col
					className='gutter-row mb-3'
					xs={24}
					sm={24}
					md={12}
					lg={12}
					xl={6}
					key={key}
				>
					<Card className={'card-custom'} style={{ width: '100%' }}>
						<div className={'card-inner'}>
							<figure>
								<img
									style={{ height: '100px' }}
									src={`../../images/${value.logo}`}
									alt={'text alt'}
								/>
							</figure>
							<Meta title={value.name} description='' />
							<Button
								className={'mt-3'}
								type='primary'
								// onClick={() => installCarrier(value.id)}
								disabled={true}
							>
								Coming Soon
							</Button>
						</div>
					</Card>
				</Col>
			);
		});
	};

	const installCarrier = (carrierId) => {};

	// const changeCarrierStatus = (carrierId, status) => {};

	return (
		<Fragment>
			<Row gutter={25}>
				<Col
					className='gutter-row mb-3'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={24}
				>
					<Title level={3} style={{ textAlign: 'center' }}>
						Welcome to Eniture Shipping
					</Title>
				</Col>
			</Row>
			<Row gutter={25}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Installed Carriers</Title>
				</Col>
				{props.installedCarriers !== undefined ? (
					getInstalledCarriers()
				) : (
					<Col
						className='gutter-row w-100 mb-3'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}
					>
						<span className={'no-data'}>No carrier installed</span>
					</Col>
				)}
			</Row>

			<Row gutter={25}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Installed Addons</Title>
				</Col>
				{props.installedAddons !== undefined ? (
					getInstalledAddons()
				) : (
					<Col
						className='gutter-row w-100 mb-3'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}
					>
						<span className={'no-data'}>No addons installed</span>
					</Col>
				)}
			</Row>

			<Row gutter={25}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Recommended Carriers</Title>
				</Col>

				{props.carriers !== undefined || props.carriers !== null ? (
					getEnitureCarriers()
				) : (
					<Col
						className='gutter-row w-100 mb-3'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}
					>
						<span className={'no-data'}>No carrier Found</span>
					</Col>
				)}
			</Row>

			<Row gutter={25}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Recommended Addons</Title>
				</Col>

				{props.addons !== undefined ? (
					getRecommendedAddons()
				) : (
					<Col
						className='gutter-row w-100 mb-3'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={24}
					>
						<span className={'no-data'}>No Addon Found</span>
					</Col>
				)}
			</Row>
		</Fragment>
	);
}

const mapStateToProps = (state) => {
	return {
		installedCarriers: state.installedCarriers,
		installedAddons: state.installedAddons,
		enitureCarriers: state.enitureCarriers,
		carriers: state.carriers,
		addons: state.addons,
		token: state.token,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getInstalledCarriers: () => dispatch(getInstalledCarriers()),
		changeCarrierStatus: (data) => dispatch(changeCarrierStatus(data)),
		getInstalledAddons: () => dispatch(getInstalledAddons()),
		changeAddonStatus: (data) => dispatch(changeAddonStatus(data)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ShippingCarriersComponent);

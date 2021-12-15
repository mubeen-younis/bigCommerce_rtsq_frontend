import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Typography, Card, Image, Avatar } from 'antd';
import { connect, useDispatch, useSelector } from 'react-redux';

import {
	installCarrier,
	getInstalledCarriers,
	changeCarrierStatus,
	changeAddonStatus,
	getInstalledAddons,
	installAddon,
} from '../../Actions/EnitureStore';
import Meta from 'antd/lib/card/Meta';
import PlanStatusHeading from '../../partials/PlanStatusHeading';
const { Title } = Typography;
// const { Meta } = Card;

function ShippingCarriersComponent(props) {
	const dispatch = useDispatch();
	const {currentPlan} = useSelector(state => state);
	const getInstalledCarriers = (carrier_type = 1) => {
		return props.installedCarriers.map((value, key) => {
			return (
				carrier_type === value.carrier_type && (
					<Col className='gutter-row mb-3' xs={24} sm={12} md={8} lg={8} xl={6} key={key}>
						<Card className={'card-custom'} style={{ width: '100%' }}>
							<div className={'card-inner'}>
								<figure>
									<Image preview={false} src={`images/${value.logo}`} />
								</figure>
								{/* <Meta title={value.name} description='' /> */}
								{value.is_enabled === 1 ? (
									<Fragment>
										<Link to={`/${value.id}`} style={{ display: 'inline-block' }}>
											<Button
												className={''}
												type='primary'
												style={{ marginRight: '6px' }}
												onClick={() =>
													dispatch({
														type: 'SET_ACTIVE_MENU',
														payload: value.id.toString(),
													})
												}
											>
												Settings
											</Button>
										</Link>

										<Button
											className={''}
											type='primary'
											onClick={() => {
												props.changeCarrierStatus(value.id, props.token);
											}}
											/* disabled={
									props.alertMessageType && props.alertMessageType === 'loading' ? 1 : 0
								} */
										>
											{value.is_enabled === 1 ? 'Disable' : 'Enable'}
										</Button>
									</Fragment>
								) : (
									<Button
										className={''}
										type='primary'
										onClick={() => {
											props.changeCarrierStatus(value.id, props.token);
										}}
										/* disabled={
									props.alertMessageType && props.alertMessageType === 'loading' ? 1 : 0
								} */
									>
										{value.is_enabled === 1 ? 'Disable' : 'Enable'}
									</Button>
								)}
							</div>
						</Card>
					</Col>
				)
			);
		});
	};

	const getInstalledAddons = () => {
		return props.installedAddons.map((value, key) => {
			return (
				<Col className='gutter-row mb-3' xs={24} sm={24} md={8} lg={8} xl={6} key={key}>
					<Card className={'card-custom'} style={{ width: '100%' }}>
						<div className={'card-inner'}>
							<figure>
								<Image preview={false} src={`images/${value.logo}`} />
								{/* <img
									style={{ height: '175px' }}
									src={`images/${value.logo}`}
									alt={'text alt'}
								/> */}
							</figure>
							{/* <Meta title={value.name} description='' /> */}
							<Button
								// className={'mt-3'}
								type='primary'
								onClick={() => props.changeAddonStatus(value.id, props.token)}
								/* disabled={
									props.alertMessageType && props.alertMessageType === 'loading' ? 1 : 0
								} */
							>
								{value.is_enabled === 1 ? 'Disable' : 'Enable'}
							</Button>
						</div>
					</Card>
				</Col>
			);
		});
	};

	const getEnitureCarriers = (carrier_type = 1) => {
		return props.carriers.map((value, key) => {
			return (
				carrier_type === value.carrier_type && (
					<Col className='gutter-row mb-3' xs={24} sm={12} md={8} lg={8} xl={6} key={key}>
						<Card className={'card-custom'} style={{ width: '100%' }}>
							<div className={'card-inner'}>
								<figure>
									<Image preview={false} src={`images/${value.logo}`} />
								</figure>
								{/* <Meta title={value.name} description='' /> */}
								<Button
									// className={'mt-3'}
									type='primary'
									onClick={() => props.installCarrier(value.id, props.token)}
									disabled={value.status ? false : true}
								>
									{value.status ? 'Install' : 'Coming Soon'}
								</Button>
							</div>
						</Card>
					</Col>
				)
			);
		});
	};

	const getRecommendedAddons = () => {
		return props.addons.map((value, key) => {
			return (
				<Col className='gutter-row mb-3' xs={24} sm={24} md={8} lg={8} xl={6} key={key}>
					<Card className={'card-custom'} style={{ width: '100%' }}>
						<div className={'card-inner'}>
							<figure>
								<Image preview={false} src={`images/${value.logo}`} />
							</figure>
							{/* <Meta title={value.name} description='' /> */}
							<Button
								// className={'mt-3'}
								type='primary'
								onClick={() => props.installAddon(value.id, props.token)}
								disabled={value.status ? false : true}
							>
								{value.status ? 'Install' : 'Coming Soon'}
							</Button>
						</div>
					</Card>
				</Col>
			);
		});
	};

	return (
		<Fragment>
			<PlanStatusHeading />
			<Row gutter={25}>
				<Col className='gutter-row mb-3' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Card
						size='default'
						style={{
							borderRadius: '5px',
							border: '1px solid skyblue',
							fontSize: '1em',
						}}
					>
						<Meta
							avatar={
								<Avatar
									src={
										<svg
											viewBox='0 0 20 20'
											className='Polaris-Icon__Svg'
											focusable='false'
											aria-hidden='true'
										>
											<path
												fillRule='evenodd'
												d='M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zM9 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V6zm1 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'
											></path>
										</svg>
									}
								/>
							}
							title={
								<h3 style={{ fontWeight: 600, marginBottom: 0 }}>Setup & testing mode</h3>
							}
							description={
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer erat
									enim, laoreet a commodo in, lacinia ut libero. Integer vitae auctor
									tortor. Pellentesque habitant morbi tristique senectus et netus et
									malesuada fames ac turpis egestas. In hac habitasse platea dictumst.
									Aliquam quis dolor molestie augue dictum rhoncus. Sed feugiat ipsum nec
									libero accumsan ultricies. Etiam posuere tristique fringilla.This is the
									description <br />
									<br /> <a href='/'>How to test my setup</a>
								</p>
							}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={25}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>LTL Freight Providers</Title>
				</Col>
				{props.installedCarriers !== undefined && props.installedCarriers.length > 0 ? (
					getInstalledCarriers(1)
				) :  null
					
				}
			</Row>

			<Row gutter={25}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Parcel & Postal Providers</Title>
				</Col>
				{props.installedCarriers !== undefined && props.installedCarriers.length > 0 ? (
					getInstalledCarriers(2)
				) : ( null
					
				)}
			</Row>

			<Row gutter={25}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Add-ons</Title>
				</Col>
				{props.installedAddons !== undefined && props.installedAddons.length > 0 ? (
					getInstalledAddons()
				) : (
					<Col className='gutter-row w-100 mb-3' xs={24} sm={24} md={24} lg={24} xl={24}>
						<span className={'no-data'}>No add-on installed</span>
					</Col>
				)}
			</Row>

			<Row gutter={25}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Other Available LTL Freight Providers</Title>
				</Col>

				{props.carriers && props.carriers.length > 0 ? (
					getEnitureCarriers(1)
				) : (
					<Col className='gutter-row w-100 mb-3' xs={24} sm={24} md={24} lg={24} xl={24}>
						<span className={'no-data'}>No carrier Found</span>
					</Col>
				)}
			</Row>

			<Row gutter={25}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Other Available Parcel & Postal Providers</Title>
				</Col>

				{props.carriers && props.carriers.length > 0 ? (
					getEnitureCarriers(2)
				) : (
					<Col className='gutter-row w-100 mb-3' xs={24} sm={24} md={24} lg={24} xl={24}>
						<span className={'no-data'}>No carrier Found</span>
					</Col>
				)}
			</Row>

			<Row gutter={25}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={4}>Other Available Add-ons</Title>
				</Col>

				{props.addons !== undefined && props.addons.length > 0 ? (
					getRecommendedAddons()
				) : (
					<Col className='gutter-row w-100 mb-3' xs={24} sm={24} md={24} lg={24} xl={24}>
						<span className={'no-data'}>No Add-on Found</span>
					</Col>
				)}
			</Row>
		</Fragment>
	);
}

const mapStateToProps = state => {
	return {
		installedCarriers: state.installedCarriers,
		installedAddons: state.installedAddons,
		enitureCarriers: state.enitureCarriers,
		carriers: state.carriers,
		addons: state.addons,
		token: state.token,
		alertMessageType: state.alertMessageType,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getInstalledCarriers: () => dispatch(getInstalledCarriers()),
		changeCarrierStatus: (data, token) => dispatch(changeCarrierStatus(data, token)),
		getInstalledAddons: () => dispatch(getInstalledAddons()),
		changeAddonStatus: (data, token) => dispatch(changeAddonStatus(data, token)),
		installCarrier: (id, token) => dispatch(installCarrier(id, token)),
		installAddon: (id, token) => dispatch(installAddon(id, token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ShippingCarriersComponent);

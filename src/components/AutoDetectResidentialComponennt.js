import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Checkbox, Radio, Typography, Card, Select, Skeleton } from 'antd';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
	getRadPlans,
	changeAddonSuspendStatus,
	changeDefaultAddress,
	changePlan,
	getAddonAddressSettings,
} from '../Actions/RAD';

const { Title } = Typography;
const { Option } = Select;

function AutoDetectResidentialComponent(props) {
	const { addon_id } = useParams();
	const [suspend, setSuspend] = useState(false);
	const [address, setAddress] = useState(1);

	useEffect(() => {
		if (!props.radPlans) {
			props.getRadPlans(props.token);
		}

		if (!props.addonSettings) {
			props.getAddonAddressSettings(addon_id, props.token);
		}

		if (props.addonSettings) {
			setAddress(props.addonSettings.unconfirmed_default);
		}

		props.installedAddons.forEach(ia =>
			ia.id === +addon_id ? setSuspend(ia.is_suspend) : null
		);

		// eslint-disable-next-line
	}, [props.addonSettings]);

	const changePlan = plan_value => {
		console.log(plan_value);
		// props.changePlan(props.token, value);
	};

	const onChange = e => {
		setAddress(e.target.value);
		props.changeDefaultAddress(addon_id, props.token, e.target.value);
	};

	if (!props.radPlans) {
		return <Skeleton active />;
	}

	return (
		<Fragment>
			<Row gutter={25}>
				<Col className='gutter-row mb-3' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Title level={3} style={{ textAlign: 'center' }}>
						Residential Address Detection
					</Title>
				</Col>
			</Row>

			<Row gutter={30} justify='center' className={'mb-3'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={12}>
					<Card style={{ width: '100%' }}>
						<p>
							The plugin will automatically detect residential addresses when this feature
							is enabled. When a residential address is detected, the residential delivery
							fee will be included in the carrier's rate estimates. The next subscription
							begins when the current one expires or is depleted, which ever comes first.
							Refer to the{' '}
							<a
								href='https://eniture.com/magento2-residential-address-detection/#documentation'
								target='_blank'
								rel='noreferrer'
							>
								{' '}
								User Guide
							</a>{' '}
							for more detailed information.
						</p>

						<label>
							<strong>Auto-renew</strong>
						</label>
						<Select
							defaultValue={
								props.radPlans && props.radPlans.current_plan.status.subscribedPackage
									? props.radPlans.current_plan.status.subscribedPackage.packageSCAC
									: 'Select RAD Plan'
							}
							style={{ width: '100%', marginBottom: '20px' }}
							onChange={changePlan}
						>
							{props.radPlans && props.radPlans.plans && props.radPlans.plans.length > 0
								? props.radPlans.plans.map(plan => (
										<Option key={plan.pSCAC} value={plan.pSCAC}>{`${
											Number(plan.pHits)
												? new Intl.NumberFormat().format(plan.pHits)
												: plan.pHits
										}/mo ($${plan.pCost})`}</Option>
								  ))
								: null}
						</Select>

						{props.radPlans &&
						props.radPlans.current_plan &&
						props.radPlans.current_plan === 'string' &&
						props.radPlans.current_plan.includes('no Subscription') ? (
							<p>
								<strong>{props.radPlans.current_plan}</strong>
							</p>
						) : (
							<Fragment>
								<label>
									<strong>Current plan</strong>
								</label>
								<div style={{ width: '100%', marginBottom: '20px' }}>
									<p style={{ marginBottom: '0' }}>
										${props.radPlans.current_plan.status.subscribedPackage.packageCost}/
										{props.radPlans.current_plan.status.subscribedPackage.packageDuration}{' '}
									</p>
									<p style={{ marginBottom: '0' }}>
										Start date:{' '}
										{new Date(
											props.radPlans.current_plan.status.subscriptionInfo.subscriptionTime
										)
											.toDateString()
											.substring(4)}{' '}
									</p>
									<p style={{ marginBottom: '0' }}>
										End date:{' '}
										{new Date(
											props.radPlans.current_plan.status.subscriptionInfo.expiryTime
										)
											.toDateString()
											.substring(4)}
									</p>
								</div>

								<label>
									<strong>Current usage</strong>
								</label>
								<div style={{ width: '100%', marginBottom: '20px' }}>
									<p style={{ marginBottom: '0' }}>
										{
											props.radPlans.current_plan.status.subscribedPackageHitsStatus
												.consumedHits
										}
										/
										{
											props.radPlans.current_plan.status.subscribedPackageHitsStatus
												.packageHits
										}{' '}
										{
											props.radPlans.current_plan.status.subscribedPackageHitsStatus
												.consumedHitsPrcent
										}
										%{' '}
										{+props.radPlans.current_plan.status.lastUsageTime.replace(
											/[-: ]/g,
											''
										) === 0
											? ''
											: `(${props.radPlans.current_plan.status.lastUsageTime})`}
									</p>
								</div>
							</Fragment>
						)}

						<div style={{ width: '100%', marginBottom: '20px' }}>
							<Checkbox
								onChange={e => {
									setSuspend(e.target.checked);
									props.changeAddonSuspendStatus(addon_id, props.token);
								}}
								checked={suspend}
							>
								Suspend Use
							</Checkbox>
						</div>

						<label>
							<strong>Default unconfirmed address types to</strong>
						</label>
						<div style={{ width: '100%', marginBottom: '20px' }}>
							<Radio.Group onChange={changeDefaultAddress} value={address}>
								<Radio
									style={{ display: 'block', marginTop: '8px' }}
									value={1}
									onChange={onChange}
								>
									Residential
								</Radio>
								<Radio
									style={{ display: 'block', marginTop: '8px' }}
									value={2}
									onChange={onChange}
								>
									Commercial
								</Radio>
							</Radio.Group>
						</div>
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
}

const mapStateToProps = state => {
	return {
		token: state.token,
		radPlans: state.radPlans,
		installedAddons: state.installedAddons,
		alertMessage: state.alertMessageType,
		addonSettings: state.addonSettings,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getRadPlans: token => dispatch(getRadPlans(token)),
		changePlan: (token, plan_package) => dispatch(changePlan(token, plan_package)),
		changeAddonSuspendStatus: (addon_id, token) =>
			dispatch(changeAddonSuspendStatus(addon_id, token)),
		getAddonAddressSettings: (addon_id, token) =>
			dispatch(getAddonAddressSettings(addon_id, token)),
		changeDefaultAddress: (addon_id, token, address_type) =>
			dispatch(changeDefaultAddress(addon_id, token, address_type)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AutoDetectResidentialComponent);

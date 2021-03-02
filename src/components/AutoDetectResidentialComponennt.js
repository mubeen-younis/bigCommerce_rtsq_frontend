import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Checkbox, Radio, Typography, Card, Select } from 'antd';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
// import TabsLayout from '../tabs_layout/tabs';
// import { getCarrierDetails } from '../Actions/Action';
import { getRadPlans, changeAddonSuspendStatus } from '../Actions/RAD';

const { Title } = Typography;
// const { Meta } = Card;
const { Option } = Select;

function AutoDetectResidentialComponennt(props) {
	const [value, setValue] = useState(1);

	const { addon_id } = useParams();

	useEffect(() => {
		if (
			!props.radPlans ||
			props.radPlans.plans === null ||
			props.radPlans.plans === undefined ||
			!props.radPlans.plans.length
		) {
			props.getRadPlans(props.token);
		}
		// eslint-disable-next-line
	});

	const changePlan = (value) => {
		console.log(value);
	};

	const changeDefaultAddress = (e) => {
		console.log('radio checked', e.target.value);
		setValue(e.target.value);
	};

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
							defaultValue='Select RAD Plan'
							style={{ width: '100%', marginBottom: '20px' }}
							onChange={changePlan}
						>
							{props.radPlans && props.radPlans.plans && props.radPlans.plans.length > 0
								? props.radPlans.plans.map((plan) => (
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
									<p style={{ marginBottom: '0' }}>100/mo ($5.00)</p>
									<p style={{ marginBottom: '0' }}>Start date: Jan 13, 2021</p>
									<p style={{ marginBottom: '0' }}>End date: Feb 13, 2021</p>
								</div>
							</Fragment>
						)}

						<label>
							<strong>Current usage</strong>
						</label>
						<div style={{ width: '100%', marginBottom: '20px' }}>
							<p style={{ marginBottom: '0' }}>35/100 35.00% (2021-02-03 05:58:26)</p>
						</div>

						<div style={{ width: '100%', marginBottom: '20px' }}>
							<Checkbox
								onChange={() => props.changeAddonSuspendStatus(addon_id, props.token)}
								checked={
									props.installedAddons
										? props.installedAddons.forEach((ic) =>
												ic.id === addon_id ? ic.is_suspend : false
										  )
										: false
								}
							>
								Suspend Use
							</Checkbox>
						</div>

						<label>
							<strong>Default unconfirmed address types to</strong>
						</label>
						<div style={{ width: '100%', marginBottom: '20px' }}>
							<Radio.Group onChange={changeDefaultAddress} value={value}>
								<Radio
									style={{ display: 'block', marginTop: '8px' }}
									value={'residential'}
								>
									Residential
								</Radio>
								<Radio
									style={{ display: 'block', marginTop: '8px' }}
									value={'commercial'}
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

const mapStateToProps = (state) => {
	return {
		token: state.token,
		radPlans: state.radPlans,
		installedAddons: state.installedAddons,
		alertMessage: state.alertMessageType,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getRadPlans: (token) => dispatch(getRadPlans(token)),
		changeAddonSuspendStatus: (addon_id, token) =>
			dispatch(changeAddonSuspendStatus(addon_id, token)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AutoDetectResidentialComponennt);

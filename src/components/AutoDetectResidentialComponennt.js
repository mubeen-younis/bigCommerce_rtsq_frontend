import React, { Fragment, useEffect } from 'react';
import {
	Row,
	Col,
	Button,
	Checkbox,
	Radio,
	Typography,
	Card,
	Select,
} from 'antd';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import TabsLayout from '../tabs_layout/tabs';
import { getCarrierDetails } from '../Actions/Action';
import { getRadPlans } from '../Actions/RAD';

const { Title } = Typography;
const { Meta } = Card;
const { Option } = Select;

function AutoDetectResidentialComponennt(props) {
	const [value, setValue] = React.useState(1);

	useEffect(() => {
		console.log('props.token ', props.token);
		props.getRadPlans(props.token);
	}, []);

	const changePlan = (value) => {
		console.log(`selected ${value}`);
	};

	const changeDefaultAddress = (e) => {
		console.log('radio checked', e.target.value);
		setValue(e.target.value);
	};

	const suspendAction = () => {};

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
						Residential Address Detection
					</Title>
				</Col>
			</Row>
			<Row gutter={30} justify='center' className={'mb-3'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={12}>
					<Card style={{ width: '100%' }}>
						<p>
							The plugin will automatically detect residential addresses when
							this feature is enabled. When a residential address is detected,
							the residential delivery fee will be included in the carrier's
							rate estimates. The next subscription begins when the current one
							expires or is depleted, which ever comes first. Refer to the{' '}
							<a
								href='https://eniture.com/magento2-residential-address-detection/#documentation'
								target='_blank'
							>
								{' '}
								User Guide
							</a>{' '}
							for more detailed information.
						</p>
						<label>
							<strong>Auto-renew</strong>
						</label>
						{console.log('props.radPlans ', props.radPlans)}
						<Select
							defaultValue='Select RAD Plan'
							style={{ width: '100%', marginBottom: '20px' }}
							onChange={changePlan}
						>
							{props.radPlans && props.radPlans.length > 0
								? props.radPlans.map((plan) => {
										return (
											<Option value={plan.pSCAC}>{`${
												Number(plan.pHits)
													? new Intl.NumberFormat().format(plan.pHits)
													: plan.pHits
											}/mo ($${plan.pCost})`}</Option>
										);
								  })
								: null}
						</Select>
						<label>
							<strong>Current plan</strong>
						</label>
						<div style={{ width: '100%', marginBottom: '20px' }}>
							<p style={{ marginBottom: '0' }}>100/mo ($5.00)</p>
							<p style={{ marginBottom: '0' }}>Start date: Jan 13, 2021</p>
							<p style={{ marginBottom: '0' }}>End date: Feb 13, 2021</p>
						</div>
						<label>
							<strong>Current usage</strong>
						</label>
						<div style={{ width: '100%', marginBottom: '20px' }}>
							<p style={{ marginBottom: '0' }}>
								35/100 35.00% (2021-02-03 05:58:26)
							</p>
						</div>
						<div style={{ width: '100%', marginBottom: '20px' }}>
							<Checkbox onChange={suspendAction}>Suspend Use</Checkbox>
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
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getRadPlans: (token) => dispatch(getRadPlans(token)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AutoDetectResidentialComponennt);

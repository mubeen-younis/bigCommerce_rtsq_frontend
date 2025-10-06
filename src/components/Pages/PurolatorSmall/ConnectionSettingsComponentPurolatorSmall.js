import React, { Fragment, useEffect, useState } from 'react'
import { Form, Input, Button, Space, Skeleton, Row, Col } from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../Actions/Action'
import { getFDOCouponCarrierInfo } from '../../../Actions/FDOActions'

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})
    const { fdoCouponInfo, fdoCouponCarrierInfo, token, isInstalling } = useSelector(
		state => state
	)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(
			getFDOCouponCarrierInfo(
				token,
				'small-package',
				fdoCouponInfo ? fdoCouponInfo?.code ?? '' : ''
			)
		)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, token])

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type })
	}

	const onFinish = values => {
		values.testType = connectionState.testType
		values.installed_carrier_id = props.carrierId
		values.carrierId = props.carrierId

		if (fdoCouponCarrierInfo)
			values.is_enabled = fdoCouponCarrierInfo.is_enabled ?? false

		props.postData(values, props.token)
	}

	if (
		props.connectionSettings === null ||
		props.connectionSettings === undefined
	) {
		return <Skeleton active />
	}

	return (
		<Fragment>
			<div className={'note-bx'}>
				<strong>Note!</strong> You must have a Purolator account to use this
				application. If you do not have one contact Purolator at
				1-888-744-7123 or{' '}
				<a
					href='https://www.purolator.com/en'
					target='_blank'
					rel='noreferrer'>
					register online
				</a>
				.
			</div>

			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size={'large'}
				initialValues={props.connectionSettings}
				onFinish={onFinish}>
                <Form.Item
                    className='mb-1'
                    label='Nickname'
                    name='nickname'
                    rules={[{ required: isInstalling ? !connectionState.testType : false, message: 'Nickname is required' }]}>
					<Input placeholder='e.g., Purolator' />
				</Form.Item>
				<Form.Item
					label='Billing Account Number'
					name='billingAccount'
                    rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Billing Account Number is required' }]}>
					<Input placeholder='Billing Account Number' />
				</Form.Item>
				<Form.Item
					label='Registered Account Number'
					name='registeredAccount'
					rules={[
                        { required: isInstalling ? connectionState.testType : true, message: 'Registered Account Number is required' },
					]}>
					<Input placeholder='Registered Account Number' />
				</Form.Item>
				<Row>
					<Col span={24}>
						<Form.Item
							label='Registered Address'
							name='senderCity'
                            rules={[{ required: isInstalling ? connectionState.testType : true, message: 'City is required' }]}>
							<Input type='text' placeholder='City' />
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<Form.Item
							name='senderState'
                            rules={[{ required: isInstalling ? connectionState.testType : true, message: 'State is required' }]}>
							<Input type='text' placeholder='State' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							style={{ marginLeft: '2em' }}
							name='senderZip'
                            rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Zip is required' }]}>
							<Input type='text' placeholder='Zip' />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					label='Production Key'
					name='productionKey'
                    rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Production Key is required' }]}>
					<Input placeholder='Production Key' />
				</Form.Item>
				<Form.Item
					className='mb-1'
					label='Production Key Password'
					name='productionPass'
                    rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Production Key Password is required' }]}>
					<Input placeholder='Production Key Password' />
				</Form.Item>

				<div>
					<a
						href='https://eniture.com/bigcommerce-purolator-connection-instructions/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your Purolator API credentials?
					</a>
				</div>

				<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
					<Space>
						<Button
							type='primary'
							size={'large'}
							htmlType='submit'
							name={`test`}
							onClick={() => handleTypeChange(true)}>
							Test Connection
						</Button>
						<Button
							type='primary'
							size={'large'}
							htmlType='submit'
							name={`save`}
							onClick={() => handleTypeChange(false)}>
							Save Settings
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Fragment>
	)
}

const mapStateToProps = state => {
	return {
		connectionSettings: state.connectionSettings,
		skeleton_loading: state.skeleton_loading,
		token: state.token,
		carrierId: state.carrierId,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		postData: (data, token) =>
			dispatch(
				postData(
					data,
					'GET_CONNECTION_SETTINGS',
					'submit_connection_settings',
					token
				)
			),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConnectionSettingsComponent)

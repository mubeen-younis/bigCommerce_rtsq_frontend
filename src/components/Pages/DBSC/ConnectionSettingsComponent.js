import React, { Fragment, useCallback, useState } from 'react'
import { Form, Input, Button, Space, Skeleton, Row, Col, Radio, Select } from 'antd'
import { connect } from 'react-redux'

import { postData } from '../../../Actions/Action'

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})
	const [form] = Form.useForm()
	const [thirdPartyCheck, setThirdPartyCheck] = useState(false)

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type })
	}

	const onFinish = values => {
		values.testType = connectionState.testType
		values.installed_carrier_id = props.carrierId
		values.carrierId = props.carrierId

		props.postData(values, props.token)
	}

	if (
		props.connectionSettings === null ||
		props.connectionSettings === undefined
	) {
		return <Skeleton active />
	} else {
		if (Object.keys(props.connectionSettings)?.length === 0) {
			props.connectionSettings.access_level = 'pro'
		}
	}
	return (
		<Fragment>
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size={'large'}
				form={form}
				initialValues={props.connectionSettings}
				onFinish={onFinish}>
				<Form.Item
					label='Select a Plan'
					name='plan'
					rules={[{ required: true, message: 'Select a Plan' }]}>
					<Select>
						<Select.Option value='Disabled (default)'>
							Disabled
						</Select.Option>
						<Select.Option value='pro'>Pro</Select.Option>
					</Select>
				</Form.Item>

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
							loading={false}
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

import React, { Fragment, useState } from 'react'
import { Form, Input, Button, Space, Skeleton, Select } from 'antd'
import { connect } from 'react-redux'
import { postData } from '../../../../Actions/Action'

const { Option } = Select

const hub_id_options = [
	'Select',
	'5185 (Allentown)',
	'5303 (Atlanta)',
	'5281 (Charlotte)',
	'5929 (Chino)',
	'5751 (Dallas)',
	'5802 (Denver)',
	'5481 (Detroit)',
	'5087 (Edison)',
	'5431 (Grove city)',
	'5771 (Houston)',
	'5436 (Groveport Ohio)',
	'5902 (Los Angeles)',
	'5465 (Indianapolis)',
	'5648 (Kansas City)',
	'5254 (Martinsburg)',
	'5379 (Memphis)',
	'5552 (Minneapolis)',
	'5531 (New Berlin)',
	'5110 (Newburgh)',
	'5015 (Northborough)',
	'5327 (Orlando)',
	'5194 (Philadelphia)',
	'5854 (Phoenix)',
	'5150 (Pittsburgh)',
	'5958 (Sacramento)',
	'5843 (Salt Lake City)',
	'5983 (Seattle)',
	'5631 (St. Louis)',
	'5893 (Reno)',
]

function ConnectionSettingsComponent(props) {
	const [connectionState, setConnectionState] = useState({
		testType: false,
		skeleton_loading: true,
	})

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type })
	}

	const onFinish = values => {
		values.testType = connectionState.testType
		values.installed_carrier_id = props.carrierId
		values.carrierId = props.carrierId

		props.postData(values, props.token)
	}

	if (props.connectionSettings === null || props.connectionSettings === undefined) {
		return <Skeleton active />
	} else {
		if (Object.keys(props.connectionSettings)?.length === 0) {
			props.connectionSettings.access_level = 'pro'
		}
	}
	return (
		<Fragment>
			<div className={'note-bx'}>
				<strong>Note!</strong> You must have a Fedex account to use this
				application. If you do not have one, contact Fedex at 800-463-3339 or{' '}
				<a href='http://www.fedex.com/us/oadr/' target='_blank' rel='noreferrer'>
					register
				</a>{' '}
				online.
			</div>
			<Form
				layout='vertical'
				name='connection_settings'
				className='connection-settings'
				size={'large'}
				initialValues={props.connectionSettings}
				onFinish={onFinish}>
				<Form.Item
					label='Account Number'
					name='account_number'
					rules={[{ required: true, message: 'Account Number' }]}>
					<Input placeholder='Account Number' />
				</Form.Item>

				<Form.Item
					label='Meter Number'
					name='meter_number'
					rules={[{ required: true, message: 'Meter Number' }]}>
					<Input placeholder='Meter Number' />
				</Form.Item>

				<Form.Item
					label='Password'
					name='password'
					rules={[{ required: true, message: 'Password' }]}>
					<Input type='text' placeholder='Password' />
				</Form.Item>

				<Form.Item
					label='Authentication Key'
					name='api_access_key'
					rules={[{ required: true, message: 'Authentication Key' }]}>
					<Input placeholder='Authentication Key' />
				</Form.Item>

				<Form.Item label='Hub Id' name='hub_id'>
					<Select defaultValue='Select'>
						{hub_id_options.map((id, index) => (
							<Option value={id} key={index}>
								{id}
							</Option>
						))}
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

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionSettingsComponent)

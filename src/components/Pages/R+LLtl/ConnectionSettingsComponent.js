import React, { Fragment, useState } from 'react'
import { Form, Input, Button, Space, Skeleton } from 'antd'
import { connect } from 'react-redux'

import { postData } from '../../../Actions/Action'

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
			<div className={'note-bx'}>
				<strong>Note!</strong> You must have an R+L Carriers account to
				use this application. If you do not have one, contact R+L
				Carriers at 800-543-5589, or request that someone contact you by
				filling out this{' '}
				<a
					href='https://www2.rlcarriers.com/contact/contact-form'
					target='_blank'
					rel='noreferrer'>
					form
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
                    required={true}
                    rules={[{ required: !connectionState.testType, message: 'Nickname is required' }]}>
					<Input placeholder='e.g., R+L Carriers' />
				</Form.Item>

                <Form.Item
                    label='Username'
                    name='username'>
					<Input placeholder='Username' />
				</Form.Item>

                <Form.Item
                    label='Password'
                    name='password'>
					<Input type='text' placeholder='Password' />
				</Form.Item>

                <Form.Item
                    className='mb-1'
                    label='API Key'
                    name='api_key'
                    required={true}
                    rules={[{ required: connectionState.testType, message: 'API Key is required' }]}>
					<Input placeholder='API Key' />
				</Form.Item>

				<div>
					<a
						href='https://eniture.com/bigcommerce-rl-connection-instructions/'
						target='_blank'
						rel='noreferrer'
					>
						How to obtain your R+L Carriers API key?
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

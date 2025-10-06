import React, { Fragment, useEffect, useState } from 'react'
import { Form, Input, Button, Space, Skeleton, Select } from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'
import { postData } from '../../../../Actions/Action'
import types from '../../../../Stores/types'

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
	const dispatch = useDispatch()
    const { connectionSettings, token, FedexSmallApiType, isInstalling } = useSelector(state => state)
	const url = 'https://eniture.com/bigcommerce-fedex-api-connection-instructions/'

	useEffect(() => {
		if (connectionSettings) {
			if(!(connectionSettings?.api_type) && (connectionSettings?.carrierId)){
				connectionSettings['api_type'] = 'legacy_api'
			}

			dispatch({
				type: types.SET_FEDEX_SMALL_API_TYPE,
				payload: connectionSettings?.api_type ?? 'new_api',
			})
		}
	}, [connectionSettings, dispatch])

	const handleTypeChange = type => {
		setConnectionState({ ...connectionState, testType: type })
	}

	const onFinish = values => {
		values = { ... props.connectionSettings, ...values, api_type: FedexSmallApiType}
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
				<strong>Note!</strong> You must have a Fedex account to use this
				application. If you do not have one, contact Fedex at 800-463-3339 or{' '}
				<a
					href='http://www.fedex.com/us/oadr/'
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
					<Input placeholder='e.g., FedEx Small' />
				</Form.Item>
				<Form.Item label='Which API Will You Connect To?' name='api_type'>
					<Select
						defaultValue={!connectionSettings?.api_type && connectionSettings?.carrierId ? 'legacy_api' : 'new_api'}
						options={[
							{ label: 'Legacy API', value: 'legacy_api' },
							{ label: 'New API', value: 'new_api' },
						]}
						onChange={opt =>
							dispatch({
								type: types.SET_FEDEX_SMALL_API_TYPE,
								payload: opt,
							})
						}
					/>
				</Form.Item>
				{ FedexSmallApiType == 'new_api' ? (
						<>
                            <Form.Item
                                label='Account Number'
                                name='new_api_account_number'
                                rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Account Number is required' }]}
                            >
								<Input placeholder='Account Number' maxLength={50}/>
							</Form.Item>

                            <Form.Item
                                label='API Key'
                                name='clientId'
                                rules={[{ required: isInstalling ? connectionState.testType : true, message: 'API Key is required' }]}
                            >
								<Input placeholder='API Key' maxLength={100}/>
							</Form.Item>

                            <Form.Item
                                className='mb-1'
                                label='Secret Key'
                                name='clientSecret'
                                rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Secret Key is required' }]}
                            >
								<Input placeholder='Secret Key' maxLength={100}/>
							</Form.Item>

							<div>
								<a
									href={url}
									target='_blank'
									rel='noreferrer'
								>
									How to obtain your FedEx API Key and Secret Key?
								</a>
							</div>
						</>
				) : (
					<>
                        <Form.Item
                            label='Account Number'
                            name='account_number'
                            rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Account Number is required' }]}>
							<Input placeholder='Account Number' maxLength={50} />
						</Form.Item>

                        <Form.Item
                            label='Meter Number'
                            name='meter_number'
                            rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Meter Number is required' }]}>
							<Input placeholder='Meter Number' maxLength={50} />
						</Form.Item>

                        <Form.Item
                            label='Password'
                            name='password'
                            rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Password is required' }]}>
							<Input type='text' placeholder='Password' maxLength={100} />
						</Form.Item>

                        <Form.Item
                            label='Authentication Key'
                            name='api_access_key'
                            rules={[{ required: isInstalling ? connectionState.testType : true, message: 'Authentication Key is required' }]}>
							<Input placeholder='Authentication Key' />
						</Form.Item>

						<Form.Item label='Hub Id' name='hub_id' className='mb-1'>
							<Select defaultValue='Select'>
								{hub_id_options.map((id, index) => (
									<Option value={id} key={index}>
										{id}
									</Option>
								))}
							</Select>
						</Form.Item>

						<div>
							<a
								href={url}
								target='_blank'
								rel='noreferrer'
							>
								How to obtain your FedEx API credentials?
							</a>
						</div>
					</>
				)}

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

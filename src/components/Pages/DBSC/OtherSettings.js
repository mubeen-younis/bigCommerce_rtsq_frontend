import { Button, Col, Form, Input, Radio, Row, Skeleton, Space } from 'antd'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	getDbscOtherSettings,
	saveDbscOtherSettings,
} from '../../../Actions/DbscActions'

const initialValues = {
	multi_label: '',
	multishipment_preference: 1,
}

const OtherSettings = () => {
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const { token, dbscOtherSettings, alertMessageType } = useSelector(
		state => state
	)

	useEffect(() => {
		if (!dbscOtherSettings) dispatch(getDbscOtherSettings(token))
	}, [token, dbscOtherSettings, dispatch])

	const onFinish = useCallback(
		values => {
			const data = {
				...dbscOtherSettings,
				...values,
			}

			dispatch(saveDbscOtherSettings(data, token))
		},
		[dbscOtherSettings, dispatch, token]
	)

	if (!dbscOtherSettings) return <Skeleton active />

	return (
		<Form
			layout='vertical'
			name='other_settings'
			className='other-settings'
			size='large'
			form={form}
			initialValues={dbscOtherSettings ?? initialValues}
			onFinish={onFinish}>
			<Row gutter={30}>
				<Col span={24}>
					<Form.Item
						label={<b>Multi-shipment label</b>}
						name='multi_label'
						className='mb-0'
						rules={[
							{
								required: false,
								message: 'Multi-shipment Label',
							},
						]}>
						<Input />
					</Form.Item>
					<div className='text-gray mt-0 mb-3'>
						Enter the label to use when more than one shipment is
						required for the order
					</div>
				</Col>
			</Row>

			<Form.Item
				label={
					<p>
						<b>
							{' '}
							In the case of a Cart that will result in multiple
							shipments
						</b>
					</p>
				}
				name='multishipment_preference'
				rules={[
					{
						required: true,
						message: 'Multishipment Preference',
					},
				]}>
				<Radio.Group>
					<Space direction='vertical'>
						<Radio value={1}>
							Add the calculated shipping rates together and display
							the total as the shipping rate
						</Radio>
						<Radio value={2}>
							Only display the most expensive calculated shipping rate
							and discard the others
						</Radio>
						<Radio value={3}>
							Only display the cheapest calculated shipping rate and
							discard the others
						</Radio>
					</Space>
				</Radio.Group>
			</Form.Item>

			<Row gutter={30} className={'mt-3'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24}>
					<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
						<Space>
							<Button
								type='primary'
								size='large'
								htmlType='submit'
								loading={alertMessageType === 'loading'}>
								Save Settings
							</Button>
						</Space>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	)
}

export default OtherSettings

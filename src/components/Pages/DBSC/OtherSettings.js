import { Form, Input, Radio, Skeleton, Space } from 'antd'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SaveButton from '../../SaveButton'

const initialValues = {
	multi_label: '',
	multishipment_preference: 1,
}

const OtherSettings = () => {
	const [form] = Form.useForm()
	const [initialState, setInitialState] = useState({})

	const { token } = useSelector(state => state)

	useEffect(() => {
		const fetchSettings = async () => {
			const { data } = await axios.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/get_dbsc_other_settings`,
				{ headers: { authorization: `Bearer ${token}` } }
			)
			if (!data.error) {
				setInitialState(data?.data ?? {})
				form.setFieldsValue(data?.data ?? {})
			}
		}

		fetchSettings()
	}, [token, form])

	const onFinish = useCallback(
		async values => {
			console.log(initialState, values)
			const { data } = await axios.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/save_dbsc_other_settings`,
				values,
				{ headers: { authorization: `Bearer ${token}` } }
			)

			console.log(data)
		},
		[token, initialState]
	)

	if (!initialState || initialState === null) return <Skeleton active />

	return (
		<Form
			layout='vertical'
			name='other_settings'
			className='other-settings'
			size='large'
			form={form}
			initialValues={initialValues}
			onFinish={onFinish}>
			<Form.Item label={<b>Multi-shipment label</b>} name='multi_label'>
				<Input />
				<div className={'text-gray'}>
					Enter the label to use when more than one shipment is required
					for the order
				</div>
			</Form.Item>

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

			<SaveButton />
		</Form>
	)
}

export default OtherSettings

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CopyOutlined } from '@ant-design/icons';
import {
	Select,
	Typography,
	Row,
	Col,
	Space,
	Button,
	Form,
} from 'antd'
import axios from 'axios';
import { dispatchAlert } from '../Utilities/dispatchAlert';
import { getUpdateProductApiToken } from '../Actions/UpdateProductApiActions';
import types from '../Stores/types';

const { Title } = Typography

function UpdateProductApiComponent() {
	const dispatch = useDispatch()
	const { token, updateProductApiToken } = useSelector(state => state)
	const [isHovered, setIsHovered] = useState(false);
	const inputRef = useRef(null);
	const [isCreated, setIsCreated] = useState(false);

	useEffect(() => {
		if (!updateProductApiToken) {
			dispatch(getUpdateProductApiToken(token))
		}

	}, [dispatch, updateProductApiToken, token])

	const copyToClipboard = (text) => {
		// Create a hidden textarea element
		const textArea = document.createElement('textarea');
		
		// Set the text to be copied
		textArea.value = text;
		
		// Style the textarea to make it invisible and prevent layout shifts
		textArea.style.position = 'fixed';
		textArea.style.top = '0';
		textArea.style.left = '0';
		textArea.style.width = '2em';
		textArea.style.height = '2em';
		textArea.style.padding = '0';
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';
		textArea.style.background = 'transparent';
		
		// Append the textarea to the document
		document.body.appendChild(textArea);
		
		// Select the text in the textarea
		textArea.select();
		textArea.setSelectionRange(0, 99999); // For mobile devices
		
		try {
		  // Execute the copy command
		  const successful = document.execCommand('copy');
		  if (successful) {
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: false,
				},
			})
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: true,
					alertMessage: 'Token copied to clipboard!',
					alertMessageType: 'success',
				},
			})
		  } else {
			console.log('Failed to copy text.');
		  }
		} catch (error) {
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: false,
				},
			})
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: true,
					alertMessage: error,
					alertMessageType: 'error',
				},
			})
		}
		
		// Remove the textarea from the document
		document.body.removeChild(textArea);
	  };

	const maskCardNumber = (number) => {
		return number.replace(/(.*-)(?=[^-]*$)/, '****-');
	};

	const generateToken = async () => {
		try {
			dispatch(dispatchAlert(true, 'loading'))
			const url = `${process.env.REACT_APP_ENITURE_API_URL}/generateApiToken`,

				config = {
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			const reqData = {}
			const {
				data: { error, data, message },
			} = await axios.post(url, reqData, config)

			if (!data.error) {
				dispatch({
					type: types.API_ACCESS_TOKEN,
					payload: data.access_token,
				})
				setIsCreated(true);
			}
			dispatch(dispatchAlert(true, error ? 'error' : 'success', message))
		} catch (err) {
			dispatch(dispatchAlert(false, null))
		}
	}

	return (
		<Fragment>
			<Form
				layout='vertical'
				name='update_product_api'
				className='form-wrp important-csv'
				size={'large'}
			>
				<Row gutter={30} justify='center' className={'mb-3'}>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Title className={'mt-0'} level={3}>
							Update product shipping parameters via the API
						</Title>
						<div className={'gray-text-block mb-3'}>
							<p>
								API tokens allow to authenticate with our application on your behalf.
							</p>
							<Form.Item style={{ textAlign: 'center', marginBottom: '0' }}>
								<Space>
									<Button
										onClick={generateToken}
										type='primary'
										size={'medium'}
										htmlType='submit'>
										Create
									</Button>
								</Space>
							</Form.Item>
							<Space span={24}>
							</Space>

							{updateProductApiToken && updateProductApiToken != '' ?
								<>
									<p style={{ textAlign: 'center' }}>

										<b ref={inputRef} >{isCreated ? updateProductApiToken : maskCardNumber(updateProductApiToken)}</b>
										<Button
											className='gray-text-block'
											style={{
												width: '5%',
												border: 'none',
												backgroundColor: '#eceef5'
											}}

											onClick={() => copyToClipboard(updateProductApiToken)}
											onMouseEnter={() => setIsHovered(true)}
											onMouseLeave={() => setIsHovered(false)}
											icon={<CopyOutlined style={{ fontSize: '25px', color: isHovered ? 'black' : '#1890ff', cursor: 'pointer' }} />}
										/>
									</p>
								</> : null
							}
						</div>
					</Col>
				</Row>
			</Form>
		</Fragment>
	)
}

export default UpdateProductApiComponent

import React, { Fragment, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import {
	sendProductsTemplateEmail,
	getHeaderRowFile,
	importDataFromFile,
} from '../../Actions/ImportCsv'
import {
	Select,
	Typography,
	Row,
	Col,
	Input,
	Space,
	Button,
	Form,
	Checkbox,
	Modal,
} from 'antd'

const { Option } = Select
const { Title } = Typography
// const props = {
//     action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
//     onChange({ file, fileList }) {
//       if (file.status !== 'uploading') {
//           //console.log(fileListState)
//         //console.log(file, fileList);
//       }
//     }
//   };

function ImportCsvComponent() {
	const dispatch = useDispatch()
	const { token, importIndexes, store } = useSelector(state => state)
	const [emailTemplateModal, setEmailTemplateModal] = useState(false)
	const [emailImportTemplateModal, setEmailImportTemplateModal] = useState(false)

	// const [fileListState, setfileListState] = useState('');
	const [fileName, setFileName] = useState(false)
	const [afterUpload, setAfterUpload] = useState(false)
	const [headers, setHeader] = useState(false)
	// const [getIndexes, setGetIndexes] = useState({});
	const [, /* selectFile */ setSelectFile] = useState('')

	const [importLocalIndex, setImportLocalIndex] = useState({
		id: 0,
		variantid: 0,
		sku: '',
		name: '',
		weight: 0,
		length: 0,
		width: 0,
		height: 0,
		quote_method: false,
		freight_class: '',
		hazardous_enabled: false,
		insurance: false,
		parcel_enabled: false,
		drop_ship_nickname: '',
		drop_ship_city: '',
		drop_ship_state: '',
		drop_ship_zip: '',
		drop_ship_country: '',
		ship_alone: '',
		vertical_rotation: '',
	})
	const [emailAddress, setEmailAddress] = useState(store.admin_email)
	const [importEmailAddress, setImportEmailAddress] = useState(store.admin_email)
	// const [getHeadersRequest,setGetHeadersRequest] = useState(true);

	const onFinish = values => {
		if (fileName) {
			//setAfterUpload(true)
			getHeaders(fileName, setAfterUpload)
		} else {
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
					alertMessage: 'CSV file is required.',
					alertMessageType: 'error',
				},
			})
		}
	}
	function onChange(e) {
		setHeader(!headers)
	}
	// const config = {
	// 	headers: {
	// 		authorization: `Bearer ${token}`,
	// 	},
	// };
	function sendEmailTemplate() {
		if (
			new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(emailAddress)
		) {
			dispatch(sendProductsTemplateEmail(emailAddress, token))
			setEmailTemplateModal(false)
		} else {
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
					alertMessage: 'Enter valid email address',
					alertMessageType: 'error',
				},
			})
		}
	}

	const getHeaders = (fileName, setAfterUpload) => {
		dispatch(getHeaderRowFile(fileName, headers, token, setAfterUpload))
	}

	const onFileChange = event => {
		// Update the state
		if (event.target.files[0]?.name === undefined) {
			setFileName(false)
		}
		let extension = event.target.files[0]?.name.split('.').pop().toLowerCase()
		if (extension === 'csv') {
			setSelectFile({ selectFile: event.target.files[0] })
			//setFileName(event?.target?.files[0]?.name);
			const formData = new FormData()
			formData.append(
				'file',
				event.target.files[0],
				event.target.files[0]?.name
			)
			formData.append('token', token)

			axios
				.post(`${process.env.REACT_APP_ENITURE_API_URL}/uploadcsv`, formData)
				.then(response => setFileName(response?.data?.filename))
		} else {
			setFileName(false)
			setSelectFile({ selectFile: null })
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
					alertMessage: 'Upload csv file',
					alertMessageType: 'error',
				},
			})
		}
	}
	const importData = () => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: false,
			},
		})
		if (importLocalIndex.id && importLocalIndex.variantid) {
			if (
				new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(
					importEmailAddress
				)
			) {
				/*setImportEmailAddress('');*/
				setFileName(false)
				dispatch(
					importDataFromFile(
						fileName,
						token,
						headers,
						importLocalIndex,
						importEmailAddress
					)
				)
				setEmailImportTemplateModal(false)
				setAfterUpload(false)
			} else {
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						showAlertMessage: true,
						alertMessage: 'Enter valid email address',
						alertMessageType: 'error',
					},
				})
			}
		} else {
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: true,
					alertMessage: 'Product Id and Variant Id are required',
					alertMessageType: 'error',
				},
			})
		}
	}

	function validateChecks() {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: false,
			},
		})
		if (importLocalIndex.id && importLocalIndex.variantid) {
			setEmailImportTemplateModal(true)
		} else {
			dispatch({
				type: 'ALERT_MESSAGE',
				payload: {
					showAlertMessage: true,
					alertMessage: 'Product Id and Variant Id are required',
					alertMessageType: 'error',
				},
			})
		}
	}

	return !afterUpload ? (
		<Fragment>
			<Form
				layout='vertical'
				name='export_csv'
				className='form-wrp important-csv'
				size={'large'}
				// onChange={handleChange}
				//onFinish={onFinish}
			>
				<Row gutter={30} justify='center' className={'mb-3'}>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Title className={'mt-3'} level={3}>
							Import CSV - Step 1
						</Title>
						<div className={'gray-text-block mb-3'}>
							<p>
								This import utility updates the product shipping
								parameters of products already created in
								BigCommerce. The utility will not create new products
								in BigCommerce for rows in the CSV file that do not
								already exist in BigCommerce.
							</p>
							<p>
								You must use this{' '}
								<a
									href='#!'
									onClick={() => setEmailTemplateModal(true)}>
									template
								</a>{' '}
								to import your product shipping parameters. It
								contains Product ID and Variant ID columns which are
								unique identifiers assigned to your products and
								product variants that are not included in the normal
								BigCommerce product export file. Do not remove these
								columns. Your import will fail without them.
							</p>
							<p>
								Eniture Technology publishes apps that provide quotes
								for Small Package (parcel) and LTL freight. The file
								contains a column with the heading "Quote Method".
								For each row of your file, input an "S" to quote the
								product as Small Package (parcel),  "L" to quote the
								product as LTL Freight, "IS" to quote the product as 
								In-Store Pickup and "LD" to quote the product as Local Delivery.
							</p>
							<p>
								Omit columns from the file that you do not want
								updated. For example, if you don't want product
								dimensions updated, columns for length, width and
								height should not be included in the file. A file
								intended to update only the weight of a product
								should only have these columns:
							</p>
							<ul>
								<li>Product ID (always required)</li>
								<li>Variant ID (always required)</li>
								<li>Quote Method (recommended)</li>
								<li>Weight</li>
							</ul>
						</div>
						<Title className={'mb-0'} level={5}>
							Heading
						</Title>
						<Form.Item className={'mb-2'} name='headers'>
							<Checkbox checked={headers} onChange={onChange}>
								The first row contains column headers
							</Checkbox>
						</Form.Item>
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Title className={'mb-0'} level={5} required>
							CSV <label style={{ color: 'red' }}>*</label>
						</Title>
						<input type='file' onChange={onFileChange} />
					</Col>
					<Col
						className='gutter-row'
						xs={24}
						sm={24}
						md={24}
						lg={24}
						xl={18}>
						<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
							<Space>
								<Button
									disabled={fileName === false ? true : false}
									onClick={onFinish}
									type='primary'
									size={'medium'}
									htmlType='submit'>
									Next
								</Button>
							</Space>
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<Modal
				title='Import Template'
				visible={emailTemplateModal}
				onOk={() => sendEmailTemplate()}
				onCancel={() => {
					setEmailTemplateModal(false)
				}}
				okText='Send'
				cancelButtonProps={{ style: { display: 'none' } }}>
				<p>
					Enter the email address to which you want the CSV Import Template
					sent.
				</p>
				<Row gutter={24}>
					<Col span={8} required>
						Email Address
					</Col>
					<Col span={16}>
						<Input
							value={emailAddress}
							required
							name='emailAddress'
							onChange={e => setEmailAddress(e.target.value)}
						/>
					</Col>
				</Row>
			</Modal>
		</Fragment>
	) : (
		// else
		<Fragment>
			<Form
				layout='vertical'
				name='import_csv'
				className='form-wrp important-csv'
				size={'large'}
				// onChange={handleChange}
				//onFinish={onFinish}
			>
				<Row gutter={30} justify='center' className={'mb-3'}>
					<Col span={12}>
						<Title className={'mt-3'} level={3}>
							Import CSV - Step 2
						</Title>
						<p>
							Use the dropdown fields to identify which columns in your
							CSV file correspond to the fields on the top.
						</p>
						<Form.Item required name='productid' label='Product Id'>
							<Select
								size={'large'}
								name='productid'
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										id: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>
						<Form.Item required name='variantid' label='Variant Id'>
							<Select
								size={'large'}
								name='variantid'
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										variantid: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>

						<Form.Item label='Product Name'>
							<Select
								size={'large'}
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										name: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>
						<Form.Item name='productsku' label='Product SKU'>
							<Select
								size={'large'}
								name='productsku'
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										sku: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>
						<Form.Item name='weight' label='Weight'>
							<Select
								size={'large'}
								name='weight'
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										weight: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>
						<Form.Item name='length' label='Length'>
							<Select
								size={'large'}
								name='length'
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										length: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>
						<Form.Item name='width' label='Width'>
							<Select
								size={'large'}
								name='width'
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										width: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>

						<Form.Item name='height' label='Height'>
							<Select
								size={'large'}
								name='height'
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										height: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>

						<Form.Item label='Quote Method'>
							<Select
								size={'large'}
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										quote_method: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>
						<Form.Item label='Freight Class'>
							<Select
								size={'large'}
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										freight_class: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>
						<Form.Item label='Hazmat'>
							<Select
								size={'large'}
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										hazardous_enabled: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>

						<Form.Item label='Insurance'>
							<Select
								size={'large'}
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										insurance: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>

						<Form.Item label='Dropship Nickname'>
							<Select
								size={'large'}
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										drop_ship_nickname: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>
						<Form.Item label='Dropship ZIP Code'>
							<Select
								size={'large'}
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										drop_ship_zip: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>
						<Form.Item label='Dropship City'>
							<Select
								size={'large'}
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										drop_ship_city: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>
						<Form.Item label='Dropship State'>
							<Select
								size={'large'}
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										drop_ship_state: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>
						<Form.Item label='Dropship Country'>
							<Select
								size={'large'}
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										drop_ship_country: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>

						<Form.Item label='Ships Alone'>
							<Select
								size={'large'}
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										ship_alone: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>
						<Form.Item label='Vertical Rotation'>
							<Select
								size={'large'}
								onChange={value => {
									setImportLocalIndex({
										...importLocalIndex,
										vertical_rotation: value,
									})
								}}>
								{importIndexes &&
									importIndexes.map(value => (
										<Option value={value} key={value}>
											{' '}
											{`${value}`}
										</Option>
									))}
							</Select>
						</Form.Item>
						<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
							<Space>
								<Button
									type='primary'
									size={'medium'}
									onClick={() => {
										setAfterUpload(false)
										setFileName(false)
									}}>
									Back
								</Button>
								<Button
									type='primary'
									size={'medium'}
									onClick={validateChecks}>
									Next
								</Button>
							</Space>
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<Modal
				title='Import Status Email'
				visible={emailImportTemplateModal}
				onOk={
					() => importData()
					//sendEmailTemplate()
				}
				onCancel={() => {
					setEmailImportTemplateModal(false)
					//setImportEmailAddress('')
				}}
				okText='Send'
				cancelButtonProps={{ style: { display: 'none' } }}>
				<p>
					Enter the email address to which you want the CSV Import status
					sent.
				</p>
				<Row gutter={24}>
					<Col span={8} required>
						Email Address
					</Col>
					<Col span={16}>
						<Input
							value={importEmailAddress}
							name='emailAddress'
							onChange={e => setImportEmailAddress(e.target.value)}
						/>
					</Col>
				</Row>
			</Modal>
		</Fragment>
	)
}

export default ImportCsvComponent

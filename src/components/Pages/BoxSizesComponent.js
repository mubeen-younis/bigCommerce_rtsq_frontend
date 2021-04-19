import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
	Select,
	Typography,
	Row,
	Col,
	Space,
	Button,
	Form,
	Checkbox,
	Input,
	Table,
	Divider,
	Modal,
	Skeleton,
} from 'antd';

import { getBoxSizes, addBoxSize, deleteBoxSize } from '../../Actions/BoxSizes';
import addKeysToList from '../../Utilities/addKey';

const { Option } = Select;
const { Title } = Typography;

const initialState = {
	nickname: '',
	box_type: 'Merchant defined Box (default)',
	length: '',
	width: '',
	height: '',
	max_weight: '',
	box_weight: '',
	box_fee: '',
	is_available: false,
};

function BoxSizesComponent(props) {
	const [visible, setVisibleAddBox] = useState(false);
	const [boxSize, setBoxSize] = useState(initialState);
	const [checkEnable, setCheckEnable] = useState(false);
	const [loadBoxSize, setLoadBoxSize] = useState(false);
	const [operation, setOperation] = useState(false);

	useEffect(() => {
		props.getBoxSizes(props.token);
	}, []);

	const onFinish = values => {
		values = { ...values };
		delete values.box_type;

		if (!operation) {
			props.addBoxSize(
				props.token,
				{ ...values, is_available: boxSize.is_available },
				'save_boxsize',
				'ADD_BOX_SIZE'
			);
		} else {
			props.addBoxSize(
				props.token,
				{ ...values, is_available: boxSize.is_available, id: boxSize.id },
				'update_boxsize',
				'UPDATE_BOX_SIZE'
			);
		}
	};

	const editBoxSize = record => {
		setOperation(true);
		setLoadBoxSize(true);
		setBoxSize({ ...record, box_type: boxSize.box_type });
		setVisibleAddBox(true);

		setTimeout(() => {
			setLoadBoxSize(false);
		}, 1000);
	};

	const columns = [
		{
			key: 'nickname',
			title: 'Nickname',
			dataIndex: 'nickname',
		},
		{
			key: 'length',
			title: 'Length(in)',
			dataIndex: 'length',
		},
		{
			key: 'width',
			title: 'Width(in)',
			dataIndex: 'width',
		},
		{
			key: 'maxWeight',
			title: 'Max Weight (LBS)',
			dataIndex: 'max_weight',
		},
		{
			key: 'boxWeight',
			title: 'Box Weight(LBS)',
			dataIndex: 'box_weight',
		},
		{
			key: 'boxFee',
			title: 'Box Fee',
			dataIndex: 'box_fee',
		},
		{
			key: 'available',
			title: 'Available',
			dataIndex: 'is_available',
		},
		{
			key: 'actions',
			title: 'Actions',
			render: (text, record) => (
				<Space size='middle'>
					<a href='#!' onClick={() => editBoxSize(record)}>
						Edit
					</a>
					<a
						href='#!'
						className={'btn-danger'}
						onClick={() => props.deleteBoxSize(record.id, props.token)}
					>
						Delete
					</a>
				</Space>
			),
		},
	];

	return (
		<Fragment>
			<Row gutter={30} justify='center' className={'mb-3'}>
				<Col className='gutter-row' xs={24} sm={18} md={16} lg={18} xl={18}>
					<div className={'content-box box-shadow'}>
						{/* <Form.Item className={'mb-2'}>
							<Checkbox
								onChange={e => setCheckEnable(!checkEnable)}
								name='check_enable'
								checked={checkEnable}
							>
								Enable
							</Checkbox>
						</Form.Item>
						<p>Current usage: $0.00 / $60.00 (0.00%)</p>
						<Row gutter={10} align='middle' justify='center'>
							<Col className='gutter-row' xs={24} sm={4} md={4} lg={4} xl={4}>
								Crapped amount: $
							</Col>
							<Col className='gutter-row' xs={24} sm={5} md={5} lg={5} xl={5}>
								<Form.Item className={'mb-0'} name='crapped_amount'>
									<Input />
								</Form.Item>
							</Col>
							<Col className='gutter-row' xs={24} sm={15} md={15} lg={15} xl={15}>
								Cost: 3 cent per calculation
							</Col>
						</Row>
						<Row gutter={10} align='middle' justify='center'>
							<Col className='gutter-row mt-3' xs={24} sm={24} md={24} lg={24} xl={24}>
								<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
									<Space>
										<Button style={{ width: '100px' }} type='primary' htmlType='submit'>
											Save
										</Button>
									</Space>
								</Form.Item>
							</Col>
						</Row>

						<Divider /> */}

						<Row gutter={10} align='middle' justify='center'>
							<Col
								className='gutter-row'
								style={{ textAlign: 'right', marginBottom: '0' }}
								xs={24}
								sm={24}
								md={24}
								lg={24}
								xl={24}
							>
								<Button
									style={{ width: '100px' }}
									type='primary'
									onClick={() => {
										setBoxSize(initialState);
										setOperation(false);
										setVisibleAddBox(true);
									}}
								>
									Add
								</Button>
								<Modal
									title={
										<Title className={'mb-0'} level={4}>
											Box Size
										</Title>
									}
									centered
									visible={visible}
									onCancel={() => setVisibleAddBox(false)}
									afterClose={() => setBoxSize(initialState)}
									destroyOnClose={true}
									footer={null}
									width={800}
								>
									{loadBoxSize ? (
										<Skeleton active />
									) : (
										<Form
											layout='vertical'
											name='add_box_sizes'
											className='form-wrp'
											size={'large'}
											onFinish={onFinish}
											initialValues={boxSize}
										>
											<Row gutter={30}>
												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={24}
													xl={24}
												>
													<Form.Item
														className={'mb-2'}
														label='Nickname'
														name='nickname'
														rules={[{ required: true, message: 'Nickname Required' }]}
													>
														<Input placeholder='Nickname' />
													</Form.Item>
												</Col>
												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={24}
													xl={24}
												>
													<Form.Item
														className={'mb-2'}
														label='Box Type'
														name='box_type'
														rules={[{ required: true, message: 'Box Type Required' }]}
													>
														<Select
															defaultValue='Merchant defined Box (default)'
															name='box_type'
														>
															<Option value='Merchant defined Box (default)'>
																Merchant defined Box (default)
															</Option>
														</Select>
													</Form.Item>
												</Col>
												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}
												>
													<Form.Item
														className={'mb-2'}
														label='Length (in)'
														name='length'
														rules={[{ required: true, message: 'Length Required' }]}
													>
														<Input type='number' placeholder='Length (in)' />
													</Form.Item>
												</Col>
												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}
												>
													<Form.Item
														className={'mb-2'}
														label='Width (in)'
														name='width'
														rules={[{ required: true, message: 'Width Required' }]}
													>
														<Input type='number' placeholder='Width (in)' />
													</Form.Item>
												</Col>
												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}
												>
													<Form.Item
														className={'mb-2'}
														label='Height (in)'
														name='height'
														rules={[{ required: true, message: 'Height Required' }]}
													>
														<Input type='number' placeholder='Height (in)' />
													</Form.Item>
												</Col>
												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}
												>
													<Form.Item
														className={'mb-2'}
														label='Max Weight (LBS)'
														name='max_weight'
														rules={[{ required: true, message: 'Max Weight (LBS)' }]}
													>
														<Input type='number' placeholder='Max Weight Required' />
													</Form.Item>
												</Col>
												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}
												>
													<Form.Item
														className={'mb-2'}
														label='Box Weight (LBS)'
														name='box_weight'
														rules={[{ required: true, message: 'Box Weight (LBS)' }]}
													>
														<Input type='number' placeholder='Box Weight Required' />
													</Form.Item>
												</Col>
												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={12}
													xl={12}
												>
													<Form.Item
														className={'mb-2'}
														label='Box Fee (e.g 1.75)'
														name='box_fee'
													>
														<Input type='number' placeholder='Box Fee' />
													</Form.Item>
												</Col>
												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={24}
													xl={24}
												>
													<Form.Item name='is_available'>
														<Checkbox
															name='is_available'
															onChange={e =>
																setBoxSize({
																	...boxSize,
																	is_available: e.target.checked,
																})
															}
															checked={boxSize.is_available}
														>
															Is Available
														</Checkbox>
													</Form.Item>
												</Col>
											</Row>
											<Row gutter={30} align='middle' className={'mt-3'}>
												<Col
													className='gutter-row'
													xs={24}
													sm={24}
													md={24}
													lg={24}
													xl={24}
												>
													<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
														<Space>
															<Button type='link' onClick={() => setVisibleAddBox(false)}>
																Cancel
															</Button>
															<Button type='primary' htmlType='submit'>
																Save
															</Button>
														</Space>
													</Form.Item>
												</Col>
											</Row>
										</Form>
									)}
								</Modal>
							</Col>
						</Row>
						<Table
							className={'custom-table mt-3'}
							dataSource={props.boxSizes ? addKeysToList(props.boxSizes) : []}
							columns={columns}
						/>
						<Title level={5}>Items that ship as multiple packages</Title>
						<p>
							Integer ut diam urna. Donec placerat, est non porttitor tincidunt, velit sem
							pharetra lorem, eget lacinia nulla mauris sit amet sapien. Vestibulum
							tincidunt auctor sapien et convallis. Vestibulum ante ipsum primis in
							faucibus orci luctus et ultrices posuere cubilia curae
						</p>
					</div>
				</Col>
			</Row>
		</Fragment>
	);
}

const mapStateToProps = state => ({
	token: state.token,
	boxSizes: state.boxSizes,
});

const mapDispatchToProps = dispatch => ({
	addBoxSize: (token, boxSize, url, type) =>
		dispatch(addBoxSize(token, boxSize, url, type)),
	getBoxSizes: token => dispatch(getBoxSizes(token)),
	deleteBoxSize: (id, token) => dispatch(deleteBoxSize(id, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BoxSizesComponent);

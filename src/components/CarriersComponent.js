import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { postData } from '../Actions/Action';
import { getServices, getAddTabSettings } from '../Actions/Carriers';
import { Form, Table, Button, Space, Skeleton } from 'antd';

const columns = [
	{
		title: 'Sr#',
		dataIndex: 'sr_no',
	},
	{
		title: 'Name',
		dataIndex: 'carrier_name',
	},
	{
		title: 'Logo',
		dataIndex: 'carrier_logo',
	},
];

const CarriersComponent = (props) => {
	const [state, setState] = useState({
		selectedRowKeys: [], // Check here to configure the default column
		loading: true,
		carrierServices: true,
	});

	const {
		getAddTabSettings,
		services,
		getServices,
		token,
		carrierId,
		postData,
		carriersSettings,
	} = props;

	useEffect(() => {
		getCarrierServices();

		if (!carriersSettings) {
			getAddTabSettings(token, carrierId);
		}
		// eslint-disable-next-line
	}, []);

	const getCarrierServices = () => {
		if (!services) {
			getServices();
		}

		if (services !== null && services !== undefined) {
			setState({ ...state, loading: false });
		}
	};

	const saveCarriers = () => {
		const data = {
			services: state.selectedRowKeys,
			carrierId: carrierId,
		};

		postData(data, 'SAVE_CARRIER_TAB_SETTINGS', 'submit_carriers', token);
	};

	const onSelectChange = (selectedRowKeys) => {
		setState({ ...state, selectedRowKeys, carrierServices: false });
	};

	const { selectedRowKeys } = state;
	let rowSelection = {};

	if (carriersSettings && state.selectedRowKeys.length === 0 && state.carrierServices) {
		rowSelection = {
			selectedRowKeys: [...selectedRowKeys, ...carriersSettings],
			onChange: onSelectChange,
		};
	} else if (Object.keys(rowSelection).length === 0) {
		rowSelection = {
			selectedRowKeys,
			onChange: onSelectChange,
		};
	}

	if (state.loading && services === undefined) {
		return (
			<Fragment>
				<Skeleton active />
			</Fragment>
		);
	}

	return (
		<Fragment>
			<Table
				className='custom-table'
				rowSelection={rowSelection}
				columns={columns}
				dataSource={services}
				total={50}
			/>
			<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
				<Space>
					<Button
						type='primary'
						size={'large'}
						htmlType='submit'
						name={`test`}
						onClick={saveCarriers}
					>
						Save Settings
					</Button>
				</Space>
			</Form.Item>
		</Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		services: state.services,
		skeleton_loading: state.skeleton_loading,
		carriersSettings: state.carriersSettings,
		token: state.token,
		carrierId: state.carrierId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		postData: (data, type, url, token) => dispatch(postData(data, type, url, token)),
		getServices: () => dispatch(getServices()),
		getAddTabSettings: (token, carrierId) =>
			dispatch(getAddTabSettings(token, carrierId)),
		dismissSkeleton: () => dispatch({ type: 'SKELETON_LOADING', payload: true }),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CarriersComponent);

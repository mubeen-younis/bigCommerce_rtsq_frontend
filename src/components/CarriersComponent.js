import React, { Fragment } from 'react';
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

class CarriersComponent extends React.Component {
	state = {
		selectedRowKeys: [], // Check here to configure the default column
		loading: true,
		carrierServices: true,
	};

	componentDidMount() {
		this.getServices();
		this.props.getAddTabSettings(this.props.token, this.props.carrierId);
	}

	getServices = () => {
		if (this.props.services === undefined) {
			this.props.getServices();
		}
		if (this.props.services !== null && this.props.services !== undefined) {
			this.setState({ loading: false });
		}
	};

	onSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys, carrierServices: false });
	};

	saveCarriers = () => {
		const data = {
			services: this.state.selectedRowKeys,
			carrierId: this.props.carrierId,
		};

		this.props.postData(
			data,
			'SAVE_CARRIER_TAB_SETTINGS',
			'submit_carriers',
			this.props.token
		);
	};

	render() {
		const { selectedRowKeys } = this.state;
		let rowSelection = {};

		if (
			this.props.carriersSettings &&
			this.state.selectedRowKeys.length === 0 &&
			this.state.carrierServices
		) {
			rowSelection = {
				selectedRowKeys: [...selectedRowKeys, ...this.props.carriersSettings],
				onChange: this.onSelectChange,
			};
		} else if (Object.keys(rowSelection).length === 0) {
			rowSelection = {
				selectedRowKeys,
				onChange: this.onSelectChange,
			};
		}

		if (this.state.loading && this.props.services === undefined) {
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
					dataSource={this.props.services}
					total={50}
				/>
				<Form.Item style={{ textAlign: 'right', marginBottom: '0' }}>
					<Space>
						<Button
							type='primary'
							size={'large'}
							htmlType='submit'
							name={`test`}
							onClick={this.saveCarriers}
						>
							Save Settings
						</Button>
					</Space>
				</Form.Item>
			</Fragment>
		);
	}
}

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

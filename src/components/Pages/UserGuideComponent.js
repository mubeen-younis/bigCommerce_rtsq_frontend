import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { postData } from '../../Actions/Action';
import { Row, Col } from 'antd';

const links = {
	'ltl-quotes':
		'https://eniture.com/woocommerce-worldwide-express-ltl-freight/#documentation',
	'small-package':
		'https://eniture.com/woocommerce-worldwide-express-small-package-plugin/#documentation',
};

function UserGuideComponent(props) {
	const selectedCarrier = props.installedCarriers.find(ic => +ic.id === +props.carrierId);

	return (
		<Fragment>
			<Row gutter={30} justify='center' className={'mb-3'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={12}>
					<div className={'content-box box-shadow'} style={{ padding: '40px' }}>
						<p>
							The User Guide for this application is maintained on the publisher's
							website. To view it click{' '}
							<a href={links[selectedCarrier.slug]} target='_blank' rel='noreferrer'>
								here
							</a>{' '}
							or paste the following link into your browser.
						</p>
						<p>{links[selectedCarrier.slug]}</p>
					</div>
				</Col>
			</Row>
		</Fragment>
	);
}

const mapStateToProps = state => {
	return {
		token: state.token,
		installedCarriers: state.installedCarriers,
		carrierId: state.carrierId,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		postData: (data, type, url, token) => dispatch(postData(data, type, url, token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserGuideComponent);

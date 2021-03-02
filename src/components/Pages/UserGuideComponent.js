import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { postData } from '../../Actions/Action';
import { Row, Col } from 'antd';

function UserGuideComponent() {
	return (
		<Fragment>
			<Row gutter={30} justify='center' className={'mb-3'}>
				<Col className='gutter-row' xs={24} sm={24} md={24} lg={18} xl={12}>
					<div className={'content-box box-shadow'} style={{ padding: '40px' }}>
						<p>
							The User Guide for this application is maintained on the publisher's
							website. To view it click <a href='#!'>here</a> or paste the following link
							into your browser.
						</p>
						<p>
							<a href='#!'>https://eniture.com/shopify-fedex-ltl-freight</a>
						</p>
					</div>
				</Col>
			</Row>
		</Fragment>
	);
}

const mapStateToProps = (state) => {
	return {
		token: state.token,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		postData: (data, type, url, token) => dispatch(postData(data, type, url, token)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserGuideComponent);

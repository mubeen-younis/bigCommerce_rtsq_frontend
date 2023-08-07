import React from 'react'
import { Row, Col, Form, Checkbox } from 'antd'

const EnableLogs = ({ quoteSettingsState, setQuoteSettingsState }) => {
	return (
		<>
			<Row gutter={30} className={'mb-3'}>
				<Col
					className='gutter-row'
					xs={24}
					sm={24}
					md={24}
					lg={24}
					xl={6}>
					<label className={'text-gray'}>Enable Logs</label>
				</Col>
				<Col
					className='gutter-row'
					xs={24}
					sm={12}
					md={12}
					lg={24}
					xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='isEnableLogs'
							value={true}
							checked={quoteSettingsState.isEnableLogs}
							onChange={e =>
								setQuoteSettingsState({
										...quoteSettingsState,
										isEnableLogs: e.target.checked,
								})
							}>
							When checked, the Logs page will contain up to 25 of the most recent transactions.
						</Checkbox>
					</Form.Item>
				</Col>
			</Row>
		</>
	)
}

export default EnableLogs
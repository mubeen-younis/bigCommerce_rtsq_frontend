import React from 'react';
import { Row, Col, Form, Typography, Input, Radio, Checkbox } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
const { Title } = Typography;

const StaffNoteSettings = ({ quoteSettingsState, handleStateChange }) => {
  const { staffNoteSettings } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
		<>
			<Row gutter={30} className={'mb-3'}>
				<Col
					className='gutter-row mt-1'
					xs={24}
					sm={24}
					md={24}
					lg={6}
					xl={6}>
					<label className={'text-gray'}>Enable Staff Notes</label>
				</Col>
				<Col
					className='gutter-row'
					xs={24}
					sm={24}
					md={24}
					lg={18}
					xl={18}>
					<Form.Item className={'mb-0'}>
						<Checkbox
							name='isEnableStaffNotes'
							value={true}
							checked={staffNoteSettings?.is_staff_note_active === 1}
							onChange={(e) =>
                dispatch({
                  type: 'TOGGLE_STAFFNOTE_SETTINGS',
                  payload: e.target.checked ? 1 : 0,
                })
							}>
							When checked, a summary of the shipping quote will be recorded in the order notes.
						</Checkbox>
					</Form.Item>
				</Col>
			</Row>
		</>
	)
};

export default StaffNoteSettings;

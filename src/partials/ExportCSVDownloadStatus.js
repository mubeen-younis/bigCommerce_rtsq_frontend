import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCSVDownloadLink } from '../Actions/ImportCsv'
import { CloseCircleOutlined } from '@ant-design/icons';

function ExportCSVDownloadStatus() {
	const { exportCSVDownloadLink, token } = useSelector(state => state)
	const dispatch = useDispatch();
	const [isVisible, setIsVisible] = useState(true);

	const onClick = () => {
		setIsVisible(!isVisible);
		dispatch(getCSVDownloadLink(token, isVisible))
	};

	const containerStyle = {
		display: isVisible ? 'block' : 'none',
	};

	return (
		<Fragment>
			{exportCSVDownloadLink ? (
				<div className='note-bx' style={containerStyle}>
				The import CSV template has finished exporting.{' '}
              	<a
                	href={exportCSVDownloadLink}
                	target='_blank'
                	rel='noreferrer'
              	>
                {' '}Click here to download it.
 				</a>{' '}
				<CloseCircleOutlined
    				style={{ fontSize: '20px', cursor: 'pointer', float: 'right' , marginTop: '2px' }}
    				onClick={onClick}
  				/>
				</div>
			) : null}
		</Fragment>
	)
}

export default ExportCSVDownloadStatus

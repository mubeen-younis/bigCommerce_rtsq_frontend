import axios from 'axios';

export const sendProductsTemplateEmail = (email, token) => {
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				showAlertMessage: true,
				alertMessageType: 'loading',
			},
		});

		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/exportProductsTemplate`,
				{
					email,
					onlyResponse: true,
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
                console.log('exportProductsTemplate')
				dispatch({
					type: 'ALERT_MESSAGE',
					payload: {
						alertMessage: data.message,
						showAlertMessage: true,
						alertMessageType: data.error ? 'error' : 'success',
					},
				});
				axios
					.post(
						`${process.env.REACT_APP_ENITURE_API_URL}/exportProductsTemplate`,
						{
							email,
						},
						{
							headers: {
								authorization: `Bearer ${token}`,
							},
						}
					)
			})
			.catch(error => {});
	};
};

export const getHeaderRowFile = (filename, hasheaders, token, setAfterUpload) => {
	return dispatch => {
		axios
			.get(
				`${process.env.REACT_APP_ENITURE_API_URL}/getRowHeaderImportedFile`,
				{
					
					headers: {
						authorization: `Bearer ${token}`
					},	
					params: {filename, hasheaders}
				}
			)
			.then(({ data }) => {
				if(!data?.error){
					dispatch({
						type: 'IMPORT_INDEXES',
						payload: data?.data,
					});
					setAfterUpload(true)
				}
			})
			.catch(error => {});
	};
}

export const importDataFromFile = (filename, token, firstHeader, indexes, importEmailAddress) => {
	return dispatch => {
		dispatch({
			type: 'ALERT_MESSAGE',
			payload: {
				alertMessage:"You will be notified at "+importEmailAddress+" about import status.",
				showAlertMessage: true,
				alertMessageType: 'success',
			},
		});

		axios
			.post(
				`${process.env.REACT_APP_ENITURE_API_URL}/importProducts`,
				{
					filename,
					indexes,
					firstHeader,
					importEmailAddress
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			)
			.then(({ data }) => {
                console.log('importDataFromFile')
			})
			.catch(error => {});
	};
}

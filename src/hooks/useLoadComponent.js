import React from 'react'
import {
	CSWweltl,
	QSWweltl,
	CSWweSmall,
	QSWweSmall,
	CSUpsLtl,
	QSUpsLtl,
	CSUpsSmall,
	QSUpsSmall,
	CSFedexLtl,
	QSFedexLtl,
	CSFedexSmall,
	QSFedexSmall,
	CSGtzLtl,
	QSGtzLtl,
	CSXpoLtl,
	QSXpoLtl,
	CSRLLTl,
	QSRLLTl,
	CSUnishippersSmall,
	QSUnishippiersSmall,
	CSDayRossLtl,
	QSDayRossLtl,
} from '../components/Pages'

const useLoadComponent = index => {
	const connectionSettigsList = [
		<CSWweltl />,
		<CSWweSmall />,
		<CSUpsLtl />,
		<CSUpsSmall />,
		<CSFedexLtl />,
		<CSFedexSmall />,
		<CSGtzLtl />,
		<CSXpoLtl />,
		<CSRLLTl />,
		<CSUnishippersSmall />,
		<CSDayRossLtl />,
	]
	const quoteSettingsList = [
		<QSWweltl />,
		<QSWweSmall />,
		<QSUpsLtl />,
		<QSUpsSmall />,
		<QSFedexLtl />,
		<QSFedexSmall />,
		<QSGtzLtl />,
		<QSXpoLtl />,
		<QSRLLTl />,
		<QSUnishippiersSmall />,
		<QSDayRossLtl />,
	]

	return [connectionSettigsList[+index], quoteSettingsList[+index]]
}

export default useLoadComponent

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
	CSFreightQuoteLtl,
	QSFreightQuoteLtl,
	CSYRCLtl,
	QSYrcLtl,
	CSEstesLtl,
	QSEstestLtl,
	CSDayRossLtl,
	QSDayRossLtl,
	CSOdflLtl,
	QSOdflLtl,
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
		<CSYRCLtl />,
		<CSFreightQuoteLtl />,
		<CSEstesLtl />,
		<CSDayRossLtl />,
		<CSOdflLtl />,
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
		<QSYrcLtl />,
		<QSFreightQuoteLtl />,
		<QSEstestLtl />,
		<QSDayRossLtl />,
		<QSOdflLtl />,
	]

	return [connectionSettigsList[+index], quoteSettingsList[+index]]
}

export default useLoadComponent

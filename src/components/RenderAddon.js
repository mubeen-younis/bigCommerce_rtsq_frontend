import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import AutoDetectResidentialComponent from './AutoDetectResidentialComponennt'
import PalletPackagingComponent from './PalletPackaging/PalletPackagingComponent'
import SmallBoxSizeComponent from './SmallBoxSizeComponent'

const addons = [
	'Residential Address Detection',
	'Standard Box Sizes',
	'Pallet Packaging',
]
const comps = [
	<AutoDetectResidentialComponent />,
	<SmallBoxSizeComponent />,
	<PalletPackagingComponent />,
]

function RendorAddon(props) {
	const { addonId, setAddonId, installedAddons } = props
	const { addon_id } = useParams()

	let component = 0
	for (const ia of installedAddons) {
		if (ia.id === +addon_id) {
			component = addons.indexOf(ia.name)
			break
		}
	}

	useEffect(() => {
		if ((addon_id !== undefined && !addonId) || addonId !== addon_id) {
			setAddonId(addon_id)
		}

		// eslint-disable-next-line
	}, [addon_id])

	return comps[component]
}

const mapStateToProps = state => {
	return {
		token: state.token,
		addonId: state.addonId,
		installedAddons: state.installedAddons,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setAddonId: addonId => dispatch({ type: 'ADDON_ID', payload: addonId }),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RendorAddon)

import { Card, Space } from 'antd'
import React, { useState } from 'react'
import AddOrigin from './ShippingOrigin/AddOrigin'

const ShippingProfile = () => {
	const [originModalVisibility, setOriginModalVisibility] = useState(false)

	return (
		<Space direction='vertical' size='large' className='w-100'>
			<Card>Profile 1</Card>
			<AddOrigin
				visible={originModalVisibility}
				toggleAddProfileModal={setOriginModalVisibility}
			/>
		</Space>
	)
}

export default ShippingProfile

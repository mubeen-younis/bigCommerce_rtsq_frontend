
export const upsBoxTypes = [
	{ label: 'UPS Simple - Extra Small (1-100 cubic inches)', id: 'UPSES' },
	{ label: 'UPS Simple - Small (101-250 cubic inches)', id: 'UPSS'},
	{ label: 'UPS Simple - Medium (251-650 cubic inches)', id: 'UPSM'},
	{ label: 'UPS Simple - Large (651-1,050 cubic inches)', id: 'UPSL' },
	{ label: 'UPS Simple - Extra Large (1,051-1,728 cubic inches)', id: 'UPSEL'},
]

export const boxDiscription = {
    UPSES:{
        dimensions: '1-100 cubic inches',
        cb_dimensions: '4 in x 4 in x 4 in, 6 in x 4 in x 4 in, 8 in x 6 in x 2 in',
        size_samples: 'Sunglasses, t-shirt, ceramic mug or cellphone',
    },
    UPSS:{
        dimensions: '101-250 cubic inches',
        cb_dimensions: '6 in x 6 in x 6 in, 8 in x 6 in x 5 in, 12 in x 9 in x 3 in',
        size_samples: 'Hardcover book, tissue box or ream of paper',
    },
    UPSM:{
        dimensions: '251-650 cubic inches',
        cb_dimensions: '8 in x 8 in x 8 in, 12 in x 9 in x 6 in, 13 in x 11 in x 2 in',
        size_samples: 'Shoebox or three-inch, three-ring binder',
    },
    UPSL:{
        dimensions: '651-1,050 cubic inches',
        cb_dimensions: '10 in x 10 in x 10 in, 12 in x 12 in x 7 in, 15 in x 11 in x 6 in',
        size_samples: 'Regulation basketball or 14-inch laptop',
    },
    UPSEL:{
        dimensions: '1,051-1,728 cubic inches',
        cb_dimensions: '12 in x 12 in x 12 in, 16 in x 12 in x 9 in, 18 in x 12 in x 6 in',
        size_samples: 'Small appliances or tennis racket',
    } 
}

export const shippingRuleTypes = {
	1: 'Restrict To Country',
    2: 'Hide Methods',
    3: 'Restrict To State',
    4: 'Restrict To Postal Codes',
    5: 'Restrict To Origin Locations',
    6: 'Override Rates',
    7: 'Hide Delivery Estimates',
    9: 'Large Cart Settings',
}

export const accessorialServices = {
	transportation: 'Transportation service',
    residential: 'Residential delivery service',
    liftgate: 'Lift gate delivery service',
    notify: 'Notify before delivery service',
    limitedAccess: 'Limited access delivery service',
    insideDelivery: 'Inside delivery service',
}
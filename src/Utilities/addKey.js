export default function addKeysToList(arr, format = false) {
	if (arr !== null && arr.length > 0) {
		return arr.map((el, key) => {
			var data = [];
			var index, dateindex, datedata;
			var dateformat = false;
			if( format === 1){
				//[data.total_inc_tax] = '$' + Number(el?.total_inc_tax).toFixed(2)
				index = ['total_inc_tax'];
				data = ['$' + Number(el?.total_inc_tax).toFixed(2)]
				//dateformat = true;
				/*dateindex = ['date_created'];
				datedata = [formatDate(el?.date_created)];*/
			}else{
				//[data.price] = '$' + Number(el?.price).toFixed(2)
				index = ['price'];
				data = ['$' + Number(el?.price).toFixed(2)]
			}
			return {
				...el,
				key: key + 1,
				[index]: [data],
				//[dateformat? "date_created": ""]: dateformat ? datedata:'',
				//is_available : el?.is_available === 1 ? 'Yes' : 'No',
				length : Number(el?.length).toFixed(2),
				width : Number(el?.width).toFixed(2),
				height : Number(el?.height).toFixed(2),
				max_weight : Number(el?.max_weight).toFixed(2),
				box_weight : Number(el?.box_weight).toFixed(2),
				//[format? "total_inc_tax": "price"]: format ? '$' + Number(el?.total_inc_tax).toFixed(2):'$' + Number(el?.price).toFixed(2),
			};
		});
	} else {
		return [];
	}
}

export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [month, day, year].join('/');
}


export const addTrailingZeros = product => {
	return {
		...product,
		weight: Number(product.weight).toFixed(2),
		height: Number(product.height).toFixed(2),
		width: Number(product.width).toFixed(2),
		length: Number(product.length).toFixed(2),
	};
};



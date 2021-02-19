export default function addKeysToList(arr) {
	if (arr !== null && arr.length > 0) {
		return arr.map((el, key) => {
			return {
				...el,
				key: key + 1,
			};
		});
	}else{
		return [];
	}
}

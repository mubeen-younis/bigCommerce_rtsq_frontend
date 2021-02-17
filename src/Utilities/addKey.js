export default function addKeysToList(arr) {
	return arr.map((el, key) => {
		return {
			...el,
			key: key + 1,
		};
	});
}

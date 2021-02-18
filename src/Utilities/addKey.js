export default function addKeysToList(arr) {
  console.log(arr);
  if (arr !== null) {
    return arr.map((el, key) => {
      return {
        ...el,
        key: key + 1,
      };
    });
  }
}

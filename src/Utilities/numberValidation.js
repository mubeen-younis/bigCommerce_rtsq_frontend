export const blockInvalidChar = e =>
	['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
export const blockInvalidCharWithPoint = e =>
	['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()
export const blockSpecialChar = e => {
	const regex = /_/;
    if (regex.test(e.key)) {
      e.preventDefault();
    }
}

export const handleKeyDownDecimalNumber = (e, allowedLength) => {
	let value = e.target.value
	let condition =
		!['Backspace', 'ArrowLeft', 'ArrowRight'].includes(e.key) &&
		([
			'=',
			'e',
			'E',
			'+',
			'-',
			'a',
			'A',
			'B',
			'b',
			'C',
			'c',
			'D',
			'd',
			'E',
			'e',
			'F',
			'f',
			'G',
			'g',
			'H',
			'h',
			'I',
			'i',
			'J',
			'j',
			'K',
			'k',
			'L',
			'l',
			'M',
			'm',
			'N',
			'n',
			'O',
			'o',
			'P',
			'Q',
			'R',
			'p',
			'q',
			'r',
			'S',
			's',
			'T',
			't',
			'U',
			'V',
			'u',
			'v',
			'W',
			'w',
			'X',
			'x',
			'Y',
			'y',
			'Z',
			'z',
		].includes(e.key) ||
			value.length >= allowedLength)
	if (condition) {
		e.preventDefault()
		return true
	}
}

export const checkDigitsAfterDecimal = (value, allowed) => {
	value = '' + value
	if (value === undefined) {
		return false
	}
	let countDigit = value.toString().split('.')[1]?.length
	let response = countDigit === undefined || countDigit <= allowed
	return !response
}

export const checkValueLimit = (value, allowed) => {
	value = '' + value
	if (value === undefined) {
		return false
	}
	let countDigit = value.toString()?.length
	let response = countDigit === undefined || countDigit <= allowed
	return !response
}

export const handlingFeeMarkup = e => {
	let allowed = [
		9, 173, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 8, 110, 37, 39, 190, 189,
		187, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105,
	]
	let charCode = e.which ? e.which : e.keyCode
	if (!allowed.includes(charCode)) {
		e.preventDefault()
	}
}

export const validateHandlingFeeMarkup = (value, inputname, fromQuotes = false) => {
	value = '' + value
	if (value === undefined || value === 'null') {
		return ''
	}
	let exploder = fromQuotes ? 'exploder' : ''
	let msg1 = inputname + ' format is invalid.' + exploder
	let msg2 =
		inputname +
		' format should be 100.22 or 10% and only 2 digits are allowed after decimal point.' +
		exploder
	if (value.includes('-') && value.includes('+')) {
		return msg1
	} else if (
		value.split('-')?.length > 2 ||
		value.split('+')?.length > 2 ||
		value.split('%')?.length > 2 ||
		value.split('.')?.length > 2
	) {
		return msg1
	} else if (value.includes('-')) {
		let beforMinus = value.split('-')[0]?.length
		if (beforMinus) {
			return msg1
		}
	} else if (value.includes('+')) {
		let beforMinus = value.split('+')[0]?.length
		if (beforMinus) {
			return msg1
		}
	}
	if (value.includes('%')) {
		if (value.split('%')[0] === '' || isNaN(value.split('%')[0])) {
			return msg1
		}
		let beforMinus = value.split('%')[1]?.length
		if (beforMinus) {
			return msg1
		}
	} else if (value !== 'undefined' && value !== 'null' && isNaN(value)) {
		return msg1
	}
	if (value.includes('.')) {
		let afterDecimal = value.split('.')[1]
		let beforeDicimal = value.split('.')[0]
		if (afterDecimal.includes('%') && afterDecimal?.length > 3) {
			return msg2
		} else if (!afterDecimal.includes('%') && afterDecimal?.length > 2) {
			return msg2
		}
		if (
			beforeDicimal?.length === 0 ||
			(beforeDicimal?.length === 1 &&
				(beforeDicimal.includes('-') || beforeDicimal.includes('+')))
		) {
			return msg1
		}
	}

	return ''
}

export const valueLimit = (value, limit, inputname) => {
	if (value === undefined) {
		return ''
	}
	let exploder = 'exploder'
	if (value > limit) {
		return (
			'The ' +
			inputname +
			' entered exceeds ' +
			limit +
			' LBS, the maximum permitted by the carrier. Please refer to the carriers service guidelines.' +
			exploder
		)
	}
	return ''
}

export const valueLimitAfterDecimal = (value, limit, inputname) => {
	value = '' + value
	if (value === undefined || value.includes('.')) {
		return ''
	}
	let afterDecimal = value.split('.')[1]
	let exploder = 'exploder'
	if (afterDecimal?.length > limit) {
		return (
			'The ' +
			inputname +
			' only 3 digits are allowed after decimal point.' +
			exploder
		)
	}
	return ''
}

export const handleKeyPhoneNumber = e => {
	let condition =
		!['Backspace', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key) &&
		!['+', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)
	if (condition) {
		e.preventDefault()
		return true
	}
}

export const handleNumbersOnly = e => {
	let condition =
		!['Backspace', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key) &&
		!['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)
	if (condition) {
		e.preventDefault()
		return true
	}
}

export const handleKeyCharNumbersOnly = e => {
	let condition =
		!['Backspace', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key) &&
		!['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'H', 
			'h', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm', 'N', 'n', 'O', 'o', 
			'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
		].includes(e.key) &&
		handleNumbersOnly(e)
	if (condition) {
		e.preventDefault()
		return true
	}
}

export const handleKeyCharOnly = e => {
	let condition =
		!['Backspace', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key) &&
		!['a',
		'A',
		'b',
		'B',
		'c',
		'C',
		'd',
		'D',
		'e',
		'E',
		'f',
		'F',
		'g',
		'G',
		'H',
		'h',
		'I',
		'i',
		'J',
		'j',
		'K',
		'k',
		'L',
		'l',
		'M',
		'm',
		'N',
		'n',
		'O',
		'o',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z',
		',',
		'.',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z',
	].includes(e.key)
	if (condition) {
		e.preventDefault()
		return true
	}
}

export const handleKeyAddress = e => {
	let condition =
		!['Backspace', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key) &&
		![
			' ',
			'_',
			'-',
			'0',
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'a',
			'A',
			'b',
			'B',
			'c',
			'C',
			'd',
			'D',
			'e',
			'E',
			'f',
			'F',
			'g',
			'G',
			'H',
			'h',
			'I',
			'i',
			'J',
			'j',
			'K',
			'k',
			'L',
			'l',
			'M',
			'm',
			'N',
			'n',
			'O',
			'o',
			'P',
			'Q',
			'R',
			'S',
			'T',
			'U',
			'V',
			'W',
			'X',
			'Y',
			'Z',
			',',
			'.',
			'p',
			'q',
			'r',
			's',
			't',
			'u',
			'v',
			'w',
			'x',
			'y',
			'z',
		].includes(e.key)
	if (condition) {
		e.preventDefault()
		return true
	}
}

export const numberFieldLimit = e => {
	blockInvalidChar(e)
	let value = e.target.value
	let condition =
		!['Backspace', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key) &&
		value.length >= 6
	if (condition) {
		e.preventDefault()
		return true
	}
	return ''
}

export const LableAsLimit = e => {
	let value = e.target.value
	let condition =
		!['Backspace', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key) &&
		value.length >= 20
	if (condition) {
		e.preventDefault()
		return true
	}
	return ''
}

export const handleNumbersWithDecimalOnly = e => {
	let condition =
		!['Backspace', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key) &&
		!['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)
	if (condition) {
		e.preventDefault()
		return true
	}
}

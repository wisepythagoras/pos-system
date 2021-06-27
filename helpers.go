package main

func DivMod(numerator, denominator int64) (quotient, remainder int64) {
	quotient = numerator / denominator
	remainder = numerator % denominator
	return
}

func IntToColumnString(col int64) string {
	str := ""

	for col > 0 {
		n, remainder := DivMod(col-1, 26)
		str = string(65+remainder) + str
		col = n
	}

	return str
}

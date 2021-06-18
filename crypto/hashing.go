package crypto

import (
	"encoding/hex"
	"hash"

	"golang.org/x/crypto/sha3"
)

var (
	// HashStrategy is the hash strategy for SHA3-512.
	HashStrategy func() hash.Hash = sha3.New512
)

// GetSHA3512Hash returns the SHA3-512 hash of a given string.
func GetSHA3512Hash(str []byte) ([]byte, error) {
	// Create a new sha object.
	h := HashStrategy()

	// Add our string to the hash.
	if _, err := h.Write([]byte(str)); err != nil {
		return nil, err
	}

	// Return the SHA3-512 digest.
	return h.Sum(nil), nil
}

// ByteArrayToHex converts a set of bytes to a hex encoded string.
func ByteArrayToHex(payload []byte) string {
	return hex.EncodeToString(payload)
}

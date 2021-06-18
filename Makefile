all:
	@ go build -o bin/pos-system-amd64
	@ GOOS=windows GOARCH=amd64 go build -o bin/pos-system-amd64.exe
	@ GOOS=linux GOARCH=arm64 go build -o bin/pos-system-arm64

ARCH := $(uname -m)

current_arch:
	@ go build -o bin/pos-system cmd/pos-system/main.go

current_arch_cgo:
	@ CGO_ENABLED=1 go build -o bin/pos-system

all:
	@ GOOS=linux GOARCH=amd64 go build -o bin/pos-linux_amd64
	@ GOOS=windows GOARCH=amd64 go build -o bin/pos-win_amd64.exe
	@ GOOS=darwin GOARCH=amd64 go build -o bin/pos-darwin_amd64
	@ GOOS=linux GOARCH=arm64 go build -o bin/pos-linux_arm64
	@ GOOS=linux GOARCH=arm go build -o bin/pos-linux_arm

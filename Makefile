ARCH := $(uname -m)

pos:
	@ go build -o bin/pos-system cmd/pos-system/main.go

pos_cgo:
	@ CGO_ENABLED=1 go build -o bin/pos-system cmd/pos-system/main.go

all: pos

# all:
# 	@ GOOS=linux GOARCH=amd64 go build -o bin/pos-linux_amd64
# 	@ GOOS=windows GOARCH=amd64 go build -o bin/pos-win_amd64.exe
# 	@ GOOS=darwin GOARCH=amd64 go build -o bin/pos-darwin_amd64
# 	@ GOOS=linux GOARCH=arm64 go build -o bin/pos-linux_arm64
# 	@ GOOS=linux GOARCH=arm go build -o bin/pos-linux_arm

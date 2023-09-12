package native

import (
	"bytes"
	"io"

	lua "github.com/yuin/gopher-lua"
	luar "layeh.com/gopher-luar"
)

func createWriter() io.Writer {
	return new(bytes.Buffer)
}

func IoModule(L *lua.LState) *lua.LTable {
	module := L.NewTable()

	L.SetField(module, "MultiWriter", luar.New(L, io.MultiWriter))
	L.SetField(module, "ReadAll", luar.New(L, io.ReadAll))
	L.SetField(module, "ReadAtLeast", luar.New(L, io.ReadAtLeast))
	L.SetField(module, "ReadFull", luar.New(L, io.ReadFull))
	L.SetField(module, "WriteString", luar.New(L, io.WriteString))
	L.SetField(module, "CreateWriter", luar.New(L, createWriter))

	return module
}

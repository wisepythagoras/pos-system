package native

import (
	"fmt"

	lua "github.com/yuin/gopher-lua"
	luar "layeh.com/gopher-luar"
)

func FmtModule(L *lua.LState) *lua.LTable {
	module := L.NewTable()

	L.SetField(module, "Fprint", luar.New(L, fmt.Fprint))
	L.SetField(module, "Fprintf", luar.New(L, fmt.Fprintf))
	L.SetField(module, "Fprintln", luar.New(L, fmt.Fprintln))
	L.SetField(module, "Print", luar.New(L, fmt.Print))
	L.SetField(module, "Printf", luar.New(L, fmt.Printf))
	L.SetField(module, "Println", luar.New(L, fmt.Println))
	L.SetField(module, "Sprintf", luar.New(L, fmt.Sprintf))

	return module
}

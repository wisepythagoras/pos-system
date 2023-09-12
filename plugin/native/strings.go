package native

import (
	"strings"

	lua "github.com/yuin/gopher-lua"
	luar "layeh.com/gopher-luar"
)

func StringsModule(L *lua.LState) *lua.LTable {
	module := L.NewTable()

	L.SetField(module, "Clone", luar.New(L, strings.Clone))
	L.SetField(module, "Compare", luar.New(L, strings.Compare))
	L.SetField(module, "Contains", luar.New(L, strings.Contains))
	L.SetField(module, "ContainsAny", luar.New(L, strings.ContainsAny))
	L.SetField(module, "Count", luar.New(L, strings.Count))
	L.SetField(module, "Cut", luar.New(L, strings.Cut))
	L.SetField(module, "EqualFold", luar.New(L, strings.EqualFold))
	L.SetField(module, "Fields", luar.New(L, strings.Fields))
	L.SetField(module, "HasPrefix", luar.New(L, strings.HasPrefix))
	L.SetField(module, "HasSuffix", luar.New(L, strings.HasSuffix))
	L.SetField(module, "Index", luar.New(L, strings.Index))
	L.SetField(module, "Join", luar.New(L, strings.Join))
	L.SetField(module, "Replace", luar.New(L, strings.Replace))
	L.SetField(module, "ReplaceAll", luar.New(L, strings.ReplaceAll))
	L.SetField(module, "Split", luar.New(L, strings.Split))
	L.SetField(module, "SplitAfter", luar.New(L, strings.SplitAfter))
	L.SetField(module, "ToUpper", luar.New(L, strings.ToUpper))
	L.SetField(module, "Trim", luar.New(L, strings.Trim))

	return module
}

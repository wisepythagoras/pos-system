package native

import (
	"path/filepath"

	lua "github.com/yuin/gopher-lua"
	luar "layeh.com/gopher-luar"
)

func FilepathModule(L *lua.LState) *lua.LTable {
	module := L.NewTable()

	L.SetField(module, "Abs", luar.New(L, filepath.Abs))
	L.SetField(module, "Base", luar.New(L, filepath.Base))
	L.SetField(module, "Clean", luar.New(L, filepath.Clean))
	L.SetField(module, "Dir", luar.New(L, filepath.Dir))
	L.SetField(module, "Ext", luar.New(L, filepath.Ext))
	L.SetField(module, "FromSlash", luar.New(L, filepath.FromSlash))
	L.SetField(module, "Glob", luar.New(L, filepath.Glob))
	L.SetField(module, "IsAbs", luar.New(L, filepath.IsAbs))
	L.SetField(module, "Join", luar.New(L, filepath.Join))
	L.SetField(module, "Match", luar.New(L, filepath.Match))
	L.SetField(module, "Rel", luar.New(L, filepath.Rel))
	L.SetField(module, "Split", luar.New(L, filepath.Split))
	L.SetField(module, "SplitList", luar.New(L, filepath.SplitList))
	L.SetField(module, "ToSlash", luar.New(L, filepath.ToSlash))
	L.SetField(module, "VolumeName", luar.New(L, filepath.VolumeName))
	L.SetField(module, "Walk", luar.New(L, filepath.Walk))
	L.SetField(module, "WalkDir", luar.New(L, filepath.WalkDir))

	return module
}

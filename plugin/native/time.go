package native

import (
	"time"

	lua "github.com/yuin/gopher-lua"
	luar "layeh.com/gopher-luar"
)

func TimeModule(L *lua.LState) *lua.LTable {
	module := L.NewTable()

	L.SetField(module, "After", luar.New(L, time.After))
	L.SetField(module, "AfterFunc", luar.New(L, time.AfterFunc))
	L.SetField(module, "Date", luar.New(L, time.Date))
	L.SetField(module, "Hour", luar.New(L, time.Hour))
	L.SetField(module, "Microsecond", luar.New(L, time.Microsecond))
	L.SetField(module, "Millisecond", luar.New(L, time.Millisecond))
	L.SetField(module, "Minute", luar.New(L, time.Minute))
	L.SetField(module, "Nanosecond", luar.New(L, time.Nanosecond))
	L.SetField(module, "NewTicker", luar.New(L, time.NewTicker))
	L.SetField(module, "NewTimer", luar.New(L, time.NewTimer))
	L.SetField(module, "Now", luar.New(L, time.Now))
	L.SetField(module, "Parse", luar.New(L, time.Parse))
	L.SetField(module, "ParseDuration", luar.New(L, time.ParseDuration))
	L.SetField(module, "ParseInLocation", luar.New(L, time.ParseInLocation))
	L.SetField(module, "Second", luar.New(L, time.Second))
	L.SetField(module, "Since", luar.New(L, time.Since))
	L.SetField(module, "Sleep", luar.New(L, time.Sleep))
	L.SetField(module, "Tick", luar.New(L, time.Tick))
	L.SetField(module, "Unix", luar.New(L, time.Unix))

	return module
}

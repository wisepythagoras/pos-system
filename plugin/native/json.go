package native

import (
	"encoding/json"
	"log"

	lua "github.com/yuin/gopher-lua"
	luar "layeh.com/gopher-luar"
)

func jsonMarshal(obj any) string {
	var res []byte
	var err error

	if res, err = json.Marshal(obj); err != nil {
		log.Println(err)
		return ""
	}

	return string(res)
}

func jsonUnmarshal(jsonStr string) any {
	res := make(map[string]any)
	var err error

	if err = json.Unmarshal([]byte(jsonStr), &res); err != nil {
		log.Println(err)
		return nil
	}

	return res
}

func JsonModule(L *lua.LState) *lua.LTable {
	module := L.NewTable()

	L.SetField(module, "Marshal", luar.New(L, jsonMarshal))
	L.SetField(module, "Unmarshal", luar.New(L, jsonUnmarshal))

	return module
}

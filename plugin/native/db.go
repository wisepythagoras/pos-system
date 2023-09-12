package native

import (
	lua "github.com/yuin/gopher-lua"
	"gorm.io/gorm"
	luar "layeh.com/gopher-luar"
)

func DBModule(L *lua.LState, db *gorm.DB) *lua.LTable {
	module := L.NewTable()

	rawDBQuery := func(query string, args ...any) any {
		var results []map[string]any

		db.Raw(query, args...).Scan(&results)

		for i, res := range results {
			for k, v := range res {
				if iValue, ok := v.(*interface{}); ok {
					results[i][k] = *iValue
				}
			}
		}

		return results
	}

	L.SetField(module, "query", luar.New(L, rawDBQuery))

	return module
}

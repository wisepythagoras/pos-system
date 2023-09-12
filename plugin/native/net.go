package native

import (
	"net"

	lua "github.com/yuin/gopher-lua"
	luar "layeh.com/gopher-luar"
)

func NetModule(L *lua.LState) *lua.LTable {
	module := L.NewTable()

	L.SetField(module, "IPv4", luar.New(L, net.IPv4))
	L.SetField(module, "IPv4allrouter", luar.New(L, net.IPv4allrouter))
	L.SetField(module, "IPv4allsys", luar.New(L, net.IPv4allsys))
	L.SetField(module, "IPv4bcast", luar.New(L, net.IPv4bcast))
	L.SetField(module, "IPv6interfacelocalallnodes", luar.New(L, net.IPv6interfacelocalallnodes))
	L.SetField(module, "IPv4len", luar.New(L, net.IPv4len))
	L.SetField(module, "IPv4zero", luar.New(L, net.IPv4zero))
	L.SetField(module, "IPv6len", luar.New(L, net.IPv6len))
	L.SetField(module, "IPv4Mask", luar.New(L, net.IPv4Mask))
	L.SetField(module, "IPv6linklocalallnodes", luar.New(L, net.IPv6linklocalallnodes))
	L.SetField(module, "IPv6linklocalallrouters", luar.New(L, net.IPv6linklocalallrouters))
	L.SetField(module, "IPv6loopback", luar.New(L, net.IPv6loopback))
	L.SetField(module, "IPv6unspecified", luar.New(L, net.IPv6unspecified))
	L.SetField(module, "IPv6zero", luar.New(L, net.IPv6zero))
	L.SetField(module, "JoinHostPort", luar.New(L, net.JoinHostPort))
	L.SetField(module, "LookupHost", luar.New(L, net.LookupHost))
	L.SetField(module, "LookupIP", luar.New(L, net.LookupIP))
	L.SetField(module, "ParseIP", luar.New(L, net.ParseIP))
	L.SetField(module, "ResolveIPAddr", luar.New(L, net.ResolveIPAddr))
	L.SetField(module, "ResolveTCPAddr", luar.New(L, net.ResolveTCPAddr))
	L.SetField(module, "ResolveUDPAddr", luar.New(L, net.ResolveUDPAddr))
	L.SetField(module, "ResolveUnixAddr", luar.New(L, net.ResolveUnixAddr))
	L.SetField(module, "SplitHostPort", luar.New(L, net.SplitHostPort))

	return module
}

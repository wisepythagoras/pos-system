package native

import (
	"os"

	lua "github.com/yuin/gopher-lua"
	luar "layeh.com/gopher-luar"
)

func OsModule(L *lua.LState) *lua.LTable {
	module := L.NewTable()

	L.SetField(module, "Chdir", luar.New(L, os.Chdir))
	L.SetField(module, "Chmod", luar.New(L, os.Chmod))
	L.SetField(module, "Chown", luar.New(L, os.Chown))
	L.SetField(module, "Create)", luar.New(L, os.Create))
	L.SetField(module, "CreateTemp", luar.New(L, os.CreateTemp))
	L.SetField(module, "DirFS", luar.New(L, os.DirFS))
	L.SetField(module, "Environ", luar.New(L, os.Environ))
	L.SetField(module, "ExpandEnv", luar.New(L, os.ExpandEnv))
	L.SetField(module, "FindProcess", luar.New(L, os.FindProcess))
	L.SetField(module, "Getegid", luar.New(L, os.Getegid))
	L.SetField(module, "Geteuid", luar.New(L, os.Geteuid))
	L.SetField(module, "Getgid", luar.New(L, os.Getgid))
	L.SetField(module, "Getgroups", luar.New(L, os.Getgroups))
	L.SetField(module, "Getpid", luar.New(L, os.Getpid))
	L.SetField(module, "Getuid", luar.New(L, os.Getuid))
	L.SetField(module, "Link", luar.New(L, os.Link))
	L.SetField(module, "LookupEnv", luar.New(L, os.LookupEnv))
	L.SetField(module, "Lstat", luar.New(L, os.Lstat))
	L.SetField(module, "Mkdir", luar.New(L, os.Mkdir))
	L.SetField(module, "MkdirAll", luar.New(L, os.MkdirAll))
	L.SetField(module, "MkdirTemp", luar.New(L, os.MkdirTemp))
	L.SetField(module, "NewFile", luar.New(L, os.NewFile))
	L.SetField(module, "Open", luar.New(L, os.Open))
	L.SetField(module, "OpenFile", luar.New(L, os.OpenFile))
	L.SetField(module, "Pipe", luar.New(L, os.Pipe))
	L.SetField(module, "ReadDir", luar.New(L, os.ReadDir))
	L.SetField(module, "ReadFile", luar.New(L, os.ReadFile))
	L.SetField(module, "Readlink", luar.New(L, os.Readlink))
	L.SetField(module, "Remove", luar.New(L, os.Remove))
	L.SetField(module, "RemoveAll", luar.New(L, os.RemoveAll))
	L.SetField(module, "Rename", luar.New(L, os.Rename))
	L.SetField(module, "SameFile", luar.New(L, os.SameFile))
	L.SetField(module, "Setenv", luar.New(L, os.Setenv))
	L.SetField(module, "Stat", luar.New(L, os.Stat))
	L.SetField(module, "Symlink", luar.New(L, os.Symlink))
	L.SetField(module, "TempDir", luar.New(L, os.TempDir))
	L.SetField(module, "Truncate", luar.New(L, os.Truncate))
	L.SetField(module, "Unsetenv", luar.New(L, os.Unsetenv))
	L.SetField(module, "WriteFile", luar.New(L, os.WriteFile))

	L.SetField(module, "DevNull", luar.New(L, os.DevNull))
	L.SetField(module, "ModeAppend", luar.New(L, os.ModeAppend))
	L.SetField(module, "ModeCharDevice", luar.New(L, os.ModeCharDevice))
	L.SetField(module, "ModeDevice", luar.New(L, os.ModeDevice))
	L.SetField(module, "ModeDir", luar.New(L, os.ModeDir))
	L.SetField(module, "ModeExclusive", luar.New(L, os.ModeExclusive))
	L.SetField(module, "ModeIrregular", luar.New(L, os.ModeIrregular))
	L.SetField(module, "ModeNamedPipe", luar.New(L, os.ModeNamedPipe))
	L.SetField(module, "ModePerm", luar.New(L, os.ModePerm))
	L.SetField(module, "ModeSetgid", luar.New(L, os.ModeSetgid))
	L.SetField(module, "ModeSetuid", luar.New(L, os.ModeSetuid))
	L.SetField(module, "ModeSocket", luar.New(L, os.ModeSocket))
	L.SetField(module, "ModeSticky", luar.New(L, os.ModeSticky))
	L.SetField(module, "ModeSymlink", luar.New(L, os.ModeSymlink))
	L.SetField(module, "ModeTemporary", luar.New(L, os.ModeTemporary))
	L.SetField(module, "ModeType", luar.New(L, os.ModeType))
	L.SetField(module, "O_APPEND", luar.New(L, os.O_APPEND))
	L.SetField(module, "O_CREATE", luar.New(L, os.O_CREATE))
	L.SetField(module, "O_EXCL", luar.New(L, os.O_EXCL))
	L.SetField(module, "O_RDONLY", luar.New(L, os.O_RDONLY))
	L.SetField(module, "O_RDWR", luar.New(L, os.O_RDWR))
	L.SetField(module, "O_SYNC", luar.New(L, os.O_SYNC))
	L.SetField(module, "O_TRUNC", luar.New(L, os.O_TRUNC))
	L.SetField(module, "O_WRONLY", luar.New(L, os.O_WRONLY))
	L.SetField(module, "Stdout", luar.New(L, os.Stdout))
	L.SetField(module, "Stderr", luar.New(L, os.Stderr))
	L.SetField(module, "Stdin", luar.New(L, os.Stdin))

	return module
}

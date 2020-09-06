'''
if v8.AddDatabase("Main_Database", "", LowPerm, True, ""):
	print("that's true")
else:
	print("failed")


'''
import LDM
v8.SetContainer(DEFAULT_CONTAINER, "")

if v8.OpenDatabase("Main_Database",""):
	pass
else:
	print("shame!")
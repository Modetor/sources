# -*- coding: utf-8 -*-

from datetime import datetime
CONN_STRING = 'server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0'
def LogError(func,exp):
    print('W [File:installer, Func: '+func+'] ScriptError > '+str(exp))

def TerminateSession(uid):
	_con = MySqlConnection(CONN_STRING)
	try:
		_con.Open()
		query = "DELETE FROM sessions WHERE uid="+str(uid)+";"
		query_command = MySqlCommand(query, _con)
		query_command.ExecuteReader()
		_con.Close()	
	except Exception as exp:
		_con.Close()	
		LogError('TerminateSession', exp)





try:
	con = MySqlConnection(CONN_STRING)
	con.Open()
	query = "SELECT uid,expd FROM sessions;"
	query_command = MySqlCommand(query, con)
	reader = query_command.ExecuteReader()
	while reader.Read():
		UID = reader[0]
		EXPD = datetime.strptime(str(reader[1]), '%d-%m-%Y %H:%M')
		if datetime.now() > EXPD:
			TerminateSession(UID)
	reader.Close()
	
	print("R [Rule:Site,File:installer] : Startup done successfuly")

except Exception as exp:
	LogError("___main___", exp)
finally:
	con.Close()
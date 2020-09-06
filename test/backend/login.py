import sys
import sqlite3
import datetime

dateNow = datetime.datetime.now()
day_of_year = dateNow.now().timetuple().tm_yday
date_range = dateNow.year*365+ day_of_year
d = str(date_range)

user_name = ServerParams.Get('un').strip()
user_pass = ServerParams.Get('up').strip()

DBFile = 'res\\data\\embed\\sources\\test\\backend\\GenericDB.db'
con = sqlite3.connect(DBFile)

curs = con.cursor()
curs.execute('SELECT * FROM users WHERE name = "'+user_name+'" and password = "'+user_pass+'";')
rows = curs.fetchone()
#help(sqlite3)
if rows == None or len(rows) == 0:
	ServerResult = '0No matches'
else:
	curs.execute("UPDATE users SET session = '"+d+"' WHERE name = '"+user_name+"';")
	data = '{"id": "'+str(rows[0])+'", "name": "'+rows[1] + '", "permission": "' + str(rows[3])+ '"}'
	ServerResult = "1;"+data


con.close()
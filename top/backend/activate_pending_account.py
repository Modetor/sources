import sqlite3
import datetime


dateNow = datetime.datetime.now()
day_of_year = dateNow.now().timetuple().tm_yday
date_range = dateNow.year*365+ day_of_year
time = dateNow.hour*60 + dateNow.minute

def ChangeStateToActive(email):
	try:
		con = sqlite3.connect('res\\data\\embed\\sources\\top\\backend\\GenericDB.db')
		cursorObj = con.cursor()
		cursorObj.execute("UPDATE Clients SET accountstate = 'active' WHERE email = '"+email+"';")
		cursorObj.execute("DELETE FROM PendingAccounts WHERE email = '"+email+"';")
		con.commit()
		con.close()
	except Exception as e:
		raise e

try:
	code = ServerParams.Get("code").strip()
	email = ServerParams.Get("email").strip()
	con = sqlite3.connect('res\\data\\embed\\sources\\top\\backend\\GenericDB.db')
	cursorObj = con.cursor()
	cursorObj.execute("SELECT expireAt FROM PendingAccounts WHERE code = '"+code+"' AND email = '"+email+"';")
	rows = cursorObj.fetchall()
	con.close()
	# check the code
	if len(rows) == 0:
		ServerResult = "Invalid activation code"
	else:
		expireAt = rows[0][0].split('_')
		exTotalDays = int(expireAt[0])
		exTotalTime = int(expireAt[1])

		if date_range > exTotalDays:
			ServerResult = "Expired : day(s) ago"
		elif time > exTotalTime:
			ServerResult = "Expired : minute(s) ago" +str(time - exTotalTime)
		else:
			ChangeStateToActive(email)
			ServerResult += "Your account has been activated<br>"
			ServerResult += "Total days : "+str(date_range)+", Time : "+str(time)
except:
	ServerResult = "Unexpected error:", sys.exc_info()






'''
if len(rows) == 0:
		ServerResult = "Invalid activation code"
	else
		






'''
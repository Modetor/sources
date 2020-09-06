'''
	Project: Libyan society messanger
	Author: Mohammad s. albay
	Modetor.
'''
import sys
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import random
import string
import datetime
import sqlite3

name = ServerParams.Get('name').strip()					#"Mohammad albay"
email = ServerParams.Get("email").strip()	        	#"MohammadAlbay99@gmail.com" 
password = ServerParams.Get('password').strip()			#"mqlprovider" 
birthdate = ServerParams.Get('birthdate').strip()		#"1999-09-12" 
createdAt = str(datetime.datetime.now())

DBFile = 'res\\data\\embed\\sources\\top\\backend\\GenericDB.db'


def CreateAccountRecord():
	accountstate = 'pending'
	try:
		con = sqlite3.connect(DBFile)
		cursorObj = con.cursor()
		cursorObj.execute('SELECT * from Clients where email = "'+ email+'";')
		rows = cursorObj.fetchall()
		if len(rows) == 0:
			entities = (name, email, password, birthdate, accountstate, createdAt)
			cursorObj.execute('''INSERT INTO Clients(name, email, password, birthdate, accountstate, createdAt) VALUES(?, ?, ?, ?, ?, ?)''', entities)
			con.commit()

		con.close()
		return True
	except:
		raise

def SaveActivationCode(email, code):
	try:
		dateNow = datetime.datetime.now()
		day_of_year = dateNow.now().timetuple().tm_yday
		date_range = dateNow.year*365+ day_of_year
		time = dateNow.hour*60 + dateNow.minute+60
		d = str(date_range)+"_"+str(time)
		con = sqlite3.connect(DBFile)
		cursorObj = con.cursor()
		# insert a row
		entities = (email, code, d)
		cursorObj.execute('''INSERT INTO PendingAccounts VALUES(?, ?, ?)''', entities)
		con.commit()
		con.close()
		return True
	except:
		return False

def IsMaximumRequestsReached(email):
	try:
		con = sqlite3.connect(DBFile)
		cursorObj = con.cursor()
		cursorObj.execute('SELECT * from PendingAccounts where email = "'+ email+'";')
		count = 0
		rows = cursorObj.fetchall()
		con.close()
		return len(rows) >= 3
	except Exception as e:
		print(e)
		return False

def IsActiveAccount():
	try:
		con = sqlite3.connect(DBFile)
		cursorObj = con.cursor()
		cursorObj.execute('SELECT accountstate from Clients where email = "'+ email+'";')
		rows = cursorObj.fetchall()
		con.close()
		if rows[0][0] == 'active':
			return True
		else:
			return False
	except:
		return False

try:
	receiver_address = email
	sender_address = 'mdsa.clientside.mail@gmail.com'
	sender_pass = 'Mqlprovider_0'
	email_code = ''.join(random.choice(string.digits) for i in range(6))
	mail_content = "<b>Hi, this is your activation code: </b>"+email_code
	if IsActiveAccount():
		ServerResult = "There's an account registered with the same email address."
	#Check if user repeate clicking...
	elif IsMaximumRequestsReached(receiver_address):
		ServerResult = "We've sent 3 codes to the same email. please  check your inbox and spam or consider using another email."
	else:
		#Setup the MIME
		message = MIMEMultipart()
		message['From'] = sender_address
		message['To'] = receiver_address
		message['Subject'] = 'A test mail sent by Python. It has an attachment.'   #The subject line
		#The body and the attachments for the mail
		message.attach(MIMEText(mail_content, 'plain'))
		#Create SMTP session for sending the mail
		session = smtplib.SMTP('smtp.gmail.com', 587) #use gmail with port
		session.starttls() #enable security
		session.login(sender_address, sender_pass) #login with mail_id and password
		text = message.as_string()
		session.sendmail(sender_address, receiver_address, text)
		session.quit()

		if SaveActivationCode(receiver_address, email_code) and CreateAccountRecord():
			ServerResult = "Activation code sent to your email."
		else:
			ServerResult = "Internal error, please try again later."

		print(ServerResult)
except:
	ServerResult = "Unexpected error:", sys.exc_info()




'''
		#cursorObj.execute('SELECT * from Clients where email = "'+ email+'";')
		rows = 0 #cursorObj.fetchall()
		if len(rows) == 0:


#session.login(sender_address, sender_pass) #login with mail_id and password
		#text = message.as_string()
		#session.sendmail(sender_address, receiver_address, text)
		#session.quit()
'''

'''
# create table
		cursorObj.execute("CREATE TABLE IF NOT EXIST PedingAccount(email text, code text, createdAt text)")
		# insert a row
		cursorObj.execute("INSERT INTO PedingAccount VALUES('"+email+"', '"+code+"', '"+d+"')")
		


con = sqlite3.connect('res\\data\\embed\\sources\\top\\backend\\GenericDB.db')
con.commit()
con.close()

cursorObj.execute("CREATE TABLE employees(id integer PRIMARY KEY, name text, salary real, department text, position text, hireDate text)")
now, 13:52 -> 832
later, 14:20 -> 860
and it's right!!
the diffs = 28m
'''
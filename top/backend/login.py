import re
import sqlite3


user_id = ServerParams.Get('user_id').strip()           #MohammadAlbay99@gmail.com
user_pass = ServerParams.Get('user_pass').strip()

user_input_email = re.match(r'[^@]+@[^@]+\.[^@]+', user_id)
user_input_userid = re.match(r'@[^@]+', user_id)

DBFile = 'res\\data\\embed\\sources\\top\\backend\\GenericDB.db'

def DoEmailLogin():
    try:
        con = sqlite3.connect(DBFile)
        cursorObj = con.cursor()
        cursorObj.execute('SELECT * from Clients where email = "'+ user_id+'";')
        rows = cursorObj.fetchall()
        con.close()
        if len(rows) == 0 or rows == None:
            return (False, 'No user found')
        else:
            return (True, rows[0])
    except Exception as e:
        return (False, 'Error occurred : '+str(e))


def DoUserIDLogin():
    global ServerResult
    ServerResult = "Matched userid.. <br />"


def DoPhoneNoLogin():
    global ServerResult
    ServerResult = "Doing phone no <br />"



'''
    start point goes here...
'''
result = None

if user_input_email:
    result = DoEmailLogin()
elif user_input_userid:
    result = DoUserIDLogin()
else:
    result = DoPhoneNoLogin()

if result[0]:
    ServerResult = '1'+str(result[1])
else:
    ServerResult = '0'+result[1]


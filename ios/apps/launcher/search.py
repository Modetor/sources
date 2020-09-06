import os
import urllib.parse
import urllib.request

try:
	request =GET["request"]
	#p = request.split("=")
	#query = urllib.parse.quote_plus(p[1])
	page = urllib.request.urlopen(request)
	charset=page.info().get_content_charset()
	content= page.read().decode(charset)
	path = os.path.dirname(__file__)+"\\"
	name = os.path.basename(__file__)

	tempFile = open(path+name, "w")
	tempFile.write(content)
	tempFile.close()
	print("server-content:this")
	#print(content)
	'''
	print(content)
	page.close()
	'''
except:
	raise
# get my money
# get+my+money
quit()
try:
	target_file = ServerParams.Get("FNF")

	txt = '''
		<html>
			<body>
				<h1>Error 404, maybe the page you request been moven.</h1>

			</body>
		</html>
		'''
	ServerResult = txt + "\n"
	ServerResult += "<B>"+target_file+"</B> is not exists"
	#print("<B>"+target_file+"</B> is not exists")
except Exception as e:
	print(e)
	raise
else:
	pass
finally:
	pass		

#import base64
from datetime import datetime 

con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')

try:
    ProductName = ServerParams.Get('name');
    ProductSerialnumber = ServerParams.Get('serialnumber');
    ProductQuantity = int(ServerParams.Get('quantity'));
    ProductFQuantity = int(ServerParams.Get('firstquantity'));
    ProductPrice = float(ServerParams.Get('price'));
    ProductWholesalePrice = float(ServerParams.Get('wsprice'));
    ProductExpireDate = datetime.strptime(ServerParams.Get('expire'), '%d-%m-%Y')
    ####
    ## Open a connection
    ####
    con.Open()
    ####
    ## use mysql to insert data
    ####
    fields = 'serialnumber, name, price,wholesaleprice,quantity, firstquantity, registerdate, expdate'
    commandString = "INSERT INTO products("+fields+") VALUES('"+ProductSerialnumber+"','"+ProductName+"',"+str(ProductPrice)+","+str(ProductWholesalePrice)+","+str(ProductQuantity)+","+str(ProductFQuantity)+",'"+datetime.now().strftime("%d-%m-%Y")+"', '"+ProductExpireDate.strftime("%d-%m-%Y")+"');"

    cmd = MySqlCommand(commandString,con)
    cmd.ExecuteNonQuery()
    ServerResult = "Done"
    con.Close()
except Exception as exp:
    ServerResult = str(exp);
finally:
    con.Close()






'''
IMPORTANT

 insert into products (serialnumber, name, price, wholesaleprice,quantity, firstquantity, measurable,registerdate, hasexp, expdate) values('2309820980930953', 'Red pool XL', 7, 6, 30,30, 0, '18-6-2020', 1, '30-4-2021');

'''
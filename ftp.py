from ftplib import FTP

ftp = FTP('boulderwall.com')
ftp.login(user='ajmetcalfe', passwd = 'QGJwy93i')

ftp.cwd('/anthonymetcalfe.com/assets')

filename = 'players.json'

localfile = open(filename, 'wb')
ftp.retrbinary('RETR ' + filename, localfile.write, 1024)

ftp.quit()
localfile.close()

# THIS WORKS!
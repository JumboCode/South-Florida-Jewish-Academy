import random
import string
import secrets

#generates a unique key as a string of 1 + 15 random letters/numbers
def generateKey():
	# key = str(1)
	# for i in range(0,15):
	# 	letterOrNum = random.randint(0,1)
	# 	if letterOrNum == 0:
	# 		key = key + random.choice(string.ascii_letters)
	# 	else:
	# 		key = key + str(random.randint(0,9))
	# print(key)
	return secrets.token_hex(10)

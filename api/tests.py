from database.studentsDOM import getInfo

def testStudentGetInfo():
	expected = 'first0'
	actual = getInfo(0, 'first_name')
	return expected == actual



def main():
	print('StudentDOM getInfo: ' + str(testStudentGetInfo()))
	return 1



if __name__ == '__main__':
	main()

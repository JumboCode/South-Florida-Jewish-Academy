from database import studentsDOM

def testStudentGetInfo():
	expected = 'first0'
	actual = studentsDOM.getInfo(0, 'first_name')
	return expected == actual

def testStudentPutInfo():
	expected = 'newlast0'
	studentsDOM.putInfo(0, 'last_name', 'newlast0')
	actual = studentsDOM.getInfo(0, 'last_name')
	return expected == actual

def testStudentGetForm():
	expected = '32'
	actual = studentsDOM.getForm(3, 0)
	return expected == actual

def testStudentPostForm():
	expected = '987'
	studentsDOM.postForm(3, 16, 987)
	actual = studentsDOM.getForm(3, 16)
	return expected == actual

def main():
	print('TEST CASES')
	print('StudentDOM getInfo: ' + str(testStudentGetInfo()))
	print('StudentDOM putInfo: ' + str(testStudentPutInfo()))
	print('StudentDOM getForm: ' + str(testStudentGetForm()))
	print('StudentDOM postForm: ' + str(testStudentPostForm()))
	return 1



if __name__ == '__main__':
	main()

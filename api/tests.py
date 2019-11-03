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

def testStudentPostStudent():
	newBasicInfo = {
        		'first_name': 'newfirst',
        		'middle_name': 'newmiddle',
        		'last_name': 'newlast',
        		'DOB': '99-99-9999',
        		'parent_ids': ['100', '100'],
        		'email': 'user999@FloridaJewishAcademy.org'
        		}
	newFormIds = {'123': '123'}
	studentsDOM.postStudent(500, newBasicInfo, newFormIds)
	return True

def main():
	print('TEST CASES')
	print('StudentDOM getInfo: ' + str(testStudentGetInfo()))
	print('StudentDOM putInfo: ' + str(testStudentPutInfo()))
	print('StudentDOM getForm: ' + str(testStudentGetForm()))
	print('StudentDOM postForm: ' + str(testStudentPostForm()))
	print('StudentDOM postForm: ' + str(testStudentPostStudent()))
	return 1



if __name__ == '__main__':
	main()

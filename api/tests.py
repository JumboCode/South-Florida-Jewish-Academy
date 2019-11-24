from database import parentsDOM

def testParentGetInfo(key, expected):
	actual = parentsDOM.getInfo(0, key)
	return expected == actual

def testParentGetForm():
	expected = '010'
	actual = parentsDOM.getParentForm(0, 1)
	return expected == actual

def testParentAddForm():
	expected = '987'
	parentsDOM.addForm(3, 16, 987)
	actual = parentsDOM.getParentForm(3, 16)
	return expected == actual

def testParentRemoveForm():
	parentsDOM.removeForm(3, 16)
	return ('Removed')

def testListStudents():
	expected = ['0']
	actual = parentsDOM.listStudents(0, 0)
	return expected == actual


def main():
	print('ParentsDOM getInfo: ' + str(testParentGetInfo('name', 'parent0')))
	print('ParentsDOM getInfo: ' + str(testParentGetInfo('DOB', '0000-00-10')))
	print('ParentsDOM getInfo: ' + str(testParentGetInfo('email', 'parent0@FloridaJewishAcademy.org')))
	print('ParentsDOM getForm: ' + str(testParentGetForm()))
	print('ParentsDOM addForm: ' + str(testParentAddForm()))
	print('ParentsDOM removeForm: ' + testParentRemoveForm())
	print('ParentsDOM listStudents: ' + str(testListStudents()))
	return 1



if __name__ == '__main__':
	main()

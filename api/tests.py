from database import studentsDOM
from database import FormsDOM
from database import parentsDOM
import subprocess

# ---------------- PARENTS ------------------------
def testParentGetInfo(key, expected):
	actual = parentsDOM.getInfo(0, key)
	return expected == actual

def testParentGetForm():
	expected = ['010', '011']
	actual = parentsDOM.getParentForm(0, 1)
	return expected == actual

def testParentAddForm():
	expected = ['987']
	parentsDOM.addForm(3, 16, 987)
	actual = parentsDOM.getParentForm(3, 16)
	return expected == actual

def testParentRemoveForm():
	parentsDOM.removeForm(3, 16)
	return parentsDOM.getParentForm(3, 16) and False

def testListStudents():
	expected = ['0']
	actual = parentsDOM.listStudents(0, 0)
	return expected == actual

# ---------------- STUDENTS -----------------------
def testStudentGetInfo():
	expected = 'first0'
	actual = studentsDOM.getInfo(0, 'first_name')
	return expected == actual

def testStudentUpdateInfo():
	expected = 'newlast0'
	studentsDOM.updateInfo(0, 'last_name', 'newlast0')
	actual = studentsDOM.getInfo(0, 'last_name')
	return expected == actual

def testStudentGetForm():
	expected = ['320', '321']
	actual = studentsDOM.getForm(3, 0)
	return expected == actual

def testStudentAddForm():
	expected = ['987']
	studentsDOM.addForm(3, 16, 987)
	actual = studentsDOM.getForm(3, 16)
	return expected == actual

def testStudentCreateStudent():
	expected = 'newfirst'
	newBasicInfo = {
        		'first_name': 'newfirst',
        		'middle_name': 'newmiddle',
        		'last_name': 'newlast',
        		'DOB': '99-99-9999',
        		'parent_ids': ['100', '100'],
        		'email': 'user999@FloridaJewishAcademy.org'
        		}
	newFormIds = {'123': '123'}
	studentsDOM.createStudent(500, newBasicInfo, newFormIds)
	actual = studentsDOM.getInfo(500, 'first_name')
	return expected == actual

def testStudentDeleteStudent():
	expected = None
	studentsDOM.deleteStudent(8)
	actual = studentsDOM.getForm(8, 2)
	return expected == actual

def testStudentRemoveForm():
	expected = None
	studentsDOM.removeForm(4, 4)
	actual = studentsDOM.getForm(4, 4)
	return expected == actual


# ---------------- FORMS -----------------------
def testFormCreateForm():
	newData = {'0': 1000}
	FormsDOM.createForm('1000', '1212-12-12', True, 123, 0.22, newData)
	actual = FormsDOM.getFormData('1000')
	return newData == actual

def testFormGetInfo():
	expected = True
	actual = FormsDOM.getInfo('000', 'required')
	return expected == actual

def testFormGetFormData():
	expected = {'0': 0, '1': 1, '2': 0, '3': 1}
	actual = FormsDOM.getFormData('000')
	return expected == actual

def testFormDeleteForm():
	expected = None
	FormsDOM.deleteForm('020')
	actual = FormsDOM.getFormData('020')
	return expected == actual

def testFormUpdateFormData():
	expected = {'0': 0, '1': 1, '2': 0, '3': 1, '123': 321}
	FormsDOM.updateFormData('010', 123, 321)
	actual = FormsDOM.getFormData('010')
	return actual == expected

## Utilities
def resetDatabase():
    subprocess.call('python3 ../bin/resetDatabase.py', shell=True)

def main():
	print('RESETTING DATABASE')
	resetDatabase()
	print('TEST CASES')
	print('-----------------STUDENTS-----------------')
	print('studentsDOM getInfo: ' + str(testStudentGetInfo()))
	print('studentsDOM updateInfo: ' + str(testStudentUpdateInfo()))
	print('studentsDOM getForm: ' + str(testStudentGetForm()))
	print('studentsDOM addForm: ' + str(testStudentAddForm()))
	print('studentsDOM createStudent: ' + str(testStudentCreateStudent()))
	print('studentsDOM deleteStudent: ' + str(testStudentDeleteStudent()))
	print('studentsDOM removeForm: ' + str(testStudentRemoveForm()))
	print('-------------------FORMS-------------------')
	print('formsDOM createForm: ' + str(testFormCreateForm()))
	print('formsDOM getInfo: ' + str(testFormGetInfo()))
	print('formsDOM getFormData: ' + str(testFormGetFormData()))
	print('formsDOM deleteForm: ' + str(testFormDeleteForm()))
	print('formsDOM updateForm: ' + str(testFormUpdateFormData()))
	print('-------------------PARENTS-------------------')
	print('ParentsDOM getInfo: ' + str(testParentGetInfo('name', 'parent0')))
	print('ParentsDOM getInfo: ' + str(testParentGetInfo('DOB', '0000-00-10')))
	print('ParentsDOM getInfo: ' + str(testParentGetInfo('email', 'parent0@FloridaJewishAcademy.org')))
	print('ParentsDOM getForm: ' + str(testParentGetForm()))
	print('ParentsDOM addForm: ' + str(testParentAddForm()))
	#print('ParentsDOM removeForm: ' + str(testParentRemoveForm()))
	print('ParentsDOM listStudents: ' + str(testListStudents()))
	return 0

if __name__ == '__main__':
	main()

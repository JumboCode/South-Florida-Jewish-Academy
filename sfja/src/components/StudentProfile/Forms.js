/* eslint-disable max-len */
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import PropTypes from 'prop-types';
import React from 'react';
import Complete from '../../utils/Complete';
import Incomplete from '../../utils/Incomplete';

const formStyle = {
  padding: 20,
};

const textSize = {
  fontSize: '13px',
};

export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export const getComparator = (order, orderBy) => {
  return order === 'desc' ?
        (a, b) => descendingComparator(a, b, orderBy) :
        (a, b) => -descendingComparator(a, b, orderBy);
}

// eslint-disable-next-line require-jsdoc
export default function Forms({forms, studentId, history}) {
  const [selected, setSelected] = React.useState(null);
  const [sortBy, setSortBy] = React.useState('form_name');
  const [order, setOrder] = React.useState('desc');
  const [sortedForms, setSortedForms] = React.useState(forms);

  const sort = (sortBy, order) => {
    const newData = stableSort(
        forms,
        getComparator(order, sortBy),
    );
    setSortBy(sortBy);
    setOrder(order);
    setSortedForms(newData);
  }
  

  return (
    <div style={formStyle}>
      <TableContainer component={Paper}>
        <Table size = 'large'>
          <TableHead>
            <TableRow >
              <TableCell style={textSize} align = "left" >
                <TableSortLabel 
                  onClick={(e) => sort('form_name', order === 'desc' ? 'asc' : 'desc')}
                  active={sortBy === 'form_name'}
                  direction={order}>
                </TableSortLabel>
                Form Name
              </TableCell>
              <TableCell style={textSize} align = "left" >
                <TableSortLabel 
                  onClick={(e) => sort('p_first_name', order === 'desc' ? 'asc' : 'desc')}
                  active={sortBy === 'p_first_name'}
                  direction={order}>
                </TableSortLabel>
                Parent Name
              </TableCell>
              <TableCell style={textSize} align = "left" >
                <TableSortLabel 
                  onClick={(e) => sort('p_email', order === 'desc' ? 'asc' : 'desc')}
                  active={sortBy === 'p_email'}
                  direction={order}>
                </TableSortLabel>
                Parent Email
              </TableCell>
              <TableCell style={textSize} align = "left" >
                <TableSortLabel 
                  onClick={(e) => sort('last_updated', order === 'desc' ? 'asc' : 'desc')}
                  active={sortBy === 'last_updated'}
                  direction={order}>
                </TableSortLabel>
                Last Updated
              </TableCell>
              <TableCell style={textSize} align = "left" >
                <TableSortLabel 
                  onClick={(e) => sort('form_year', order === 'desc' ? 'asc' : 'desc')}
                  active={sortBy === 'form_year'}
                  direction={order}>
                </TableSortLabel>
                Form Year
              </TableCell>
              <TableCell style={textSize} align = "right" >
                <TableSortLabel 
                  onClick={(e) => sort('completed', order === 'desc' ? 'asc' : 'desc')}
                  active={sortBy === 'completed'}
                  direction={order}>
                </TableSortLabel>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedForms.map((form) => (
              <TableRow
                key={form['form_id']}
                style={{cursor: 'pointer', backgroundColor: form['completed'] ? 'rgba(76, 209, 27, ' + (selected === form['form_id'] ? '0.7' : '0.5') + ')' : selected === form['form_id'] ? 'rgba(211,211,211, 0.7)': '#ffffff'}}
                onClick={() => history.push('/students/' + studentId + '/' + form['form_id'])}
                onMouseEnter={() => setSelected(form['form_id'])}
                onMouseLeave={() => setSelected(null)}
              >
                <TableCell style={textSize} align = "left" >{form['form_name']}</TableCell>
                <TableCell style={textSize} align = "left" >{form['p_first_name']} {form['p_last_name']}</TableCell>
                <TableCell style={textSize} align = "left" >{form['p_email']}</TableCell>
                <TableCell style={textSize} align = "left">{form['last_updated']=== null ? 'N/A': form['last_updated']}</TableCell>
                <TableCell style={textSize} align = "left" >{form['form_year']}</TableCell>
                <TableCell style={textSize} align = "right">{form['completed']=== true ? <Complete/> : <Incomplete/>}</TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

Forms.propTypes = {
  forms: PropTypes.object,
  studentId: PropTypes.string,
  history: PropTypes.object,
};

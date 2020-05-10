/* eslint-disable max-len */
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import PropTypes from 'prop-types';
import React from 'react';
import {NavLink} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Complete from '../../utils/Complete';
import Incomplete from '../../utils/Incomplete';

const formStyle = {
  padding: 20,
};

const textSize = {
  fontSize: '13px',
};


// eslint-disable-next-line require-jsdoc
export default function Forms({forms, studentId}) {
  return (
    <div style={formStyle}>
      <TableContainer component={Paper}>
        <Table size = 'large'>
          <TableHead>
            <TableRow >
              <TableCell style={textSize} align = "left" >Form Name</TableCell>
              <TableCell style={textSize} align = "left" >Parent Name</TableCell>
              <TableCell style={textSize} align = "left" >Parent Email</TableCell>
              <TableCell style={textSize} align = "left" >Last Updated</TableCell>
              <TableCell style={textSize} align = "right" >Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form['_id']}>
                <TableCell>
                  <NavLink to={'/profile/' + studentId + '/' + form['form_id']}>
                    <Typography align="left" style={textSize}>
                      {form['form_name']}</Typography>
                  </NavLink>
                </TableCell>
                <TableCell style={textSize} align = "left" >{form['p_first_name']} {form['p_last_name']}</TableCell>
                <TableCell style={textSize} align = "left" >{form['p_email']}</TableCell>
                <TableCell style={textSize} align = "left">{form['last_updated']=== null ? 'N/A': form['last_updated']}</TableCell>
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
};

import React from 'react';
import {
  Checkbox,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  Paper,
} from '@material-ui/core';

// eslint-disable-next-line require-jsdoc
function sortGrades(a, b) {
  const aSplit = a.split('_');
  const bSplit = b.split('_');
  if (aSplit.length === 1 && bSplit.length === 1) {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return aSplit[1] - bSplit[1];
  }
}

// eslint-disable-next-line require-jsdoc
function processOption(s) {
  const list = s.split('_');
  const resultList = [];
  for (let i = 0; i < list.length; i++) {
    resultList.push(list[i][0].toUpperCase() + list[i].substring(1));
  }
  return resultList.join(' ');
}

// eslint-disable-next-line require-jsdoc,react/prop-types
export default function Filters({filters, updateFilter, updateFormChecked, studentsLength, blankForms}) {
  const [selected, setSelected] = React.useState(null);
  if (filters === undefined) {
    return (<div>
      <Paper>
        Filters
      </Paper>
    </div>);
  }
  return (
    <div>
      <Paper>
      Filters
        {Object.keys(filters).map((filter) => (
          <div key={filter}>
            <div style={{textAlign: 'left', paddingLeft: 10}}>
              {filter[0].toUpperCase().concat(filter.substring(1)).concat(':')}
            </div>
            <List>
              {/* eslint-disable-next-line max-len */}
              {Object.keys(filters[filter]).sort(sortGrades).map((optionKey) => (
                <ListItem
                  key={optionKey}
                  onClick={
                    () => updateFilter(
                        filter,
                        optionKey,
                        !filters[filter][optionKey],
                    )
                  }
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selected === filter + optionKey ?
                      'rgba(211,211,211, 0.7)' :
                      '#ffffff'}}
                  onMouseEnter={() => setSelected(filter + optionKey)}
                  onMouseLeave={() => setSelected(null)}
                >
                  <ListItemIcon
                    style={{cursor: 'pointer'}}
                  >
                    <Checkbox
                      edge="start"
                      checked={filters[filter][optionKey]}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{'aria-labelledby': optionKey}}
                    />
                    {processOption(optionKey)}
                  </ListItemIcon>
                </ListItem>
              ))}
              {filter === 'grades' && studentsLength === null ?
                // eslint-disable-next-line max-len
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}>
                  <CircularProgress/>
                </div> : null}
            </List>
          </div>
        ))}
        <div style={{display: 'flex', fontSize: 13, padding: 10}}>
          Total student count: {studentsLength}
        </div>
      </Paper>
      <Paper style={{marginTop: 20}}>
        Forms
        <List>
          {blankForms.map((form) => (<ListItem
            key={form.id}
            onClick={() => updateFormChecked(form.id, !form.checked)}
            onMouseEnter={() => setSelected('form' + form.id)}
            onMouseLeave={() => setSelected(null)}
            style={{
              cursor: 'pointer',
              backgroundColor: selected === 'form' + form.id ?
                'rgba(211,211,211, 0.7)' :
                '#ffffff'}}
          >
            <ListItemIcon>
              <Checkbox
                edge='start'
                checked={form.checked}
              />
              {form.name}
            </ListItemIcon>
          </ListItem>))}
        </List>
      </Paper>
    </div>);
}

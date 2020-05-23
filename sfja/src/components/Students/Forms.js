import React from 'react';
import {Checkbox, List, ListItem, ListItemIcon, Paper} from '@material-ui/core';
import ScaleText from 'react-scale-text';

// eslint-disable-next-line require-jsdoc,react/prop-types,max-len
export default function Forms({updateFormChecked, blankForms}) {
  const [selected, setSelected] = React.useState(null);
  return (
    <Paper
      style={{marginTop: 20}}
    >
      Forms
      <List>
        {/* eslint-disable-next-line react/prop-types */}
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
          <ListItemIcon
            style={{width: 300}}
          >
            <Checkbox
              edge='start'
              checked={form.checked}
            />
            <ScaleText
              widthOnly={true}
              maxFontSize={20}
            >
              {form.name}
            </ScaleText>
          </ListItemIcon>
        </ListItem>))}
      </List>
    </Paper>);
}

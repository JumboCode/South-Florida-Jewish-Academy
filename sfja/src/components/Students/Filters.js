import React from 'react';
import {Checkbox, List, ListItem, ListItemIcon, Paper} from '@material-ui/core';


// eslint-disable-next-line require-jsdoc
function processOption(s) {
  const list = s.split('_');
  const resultList = [];
  for (let i = 0; i < list.length; i++) {
    resultList.push(list[i][0].toUpperCase() + list[i].substring(1));
  }
  return resultList.join(' ');
}
// eslint-disable-next-line require-jsdoc
class Filters extends React.Component {
  // eslint-disable-next-line require-jsdoc
  render() {
    // eslint-disable-next-line react/prop-types
    const {filters, updateFilter} = this.props;
    if (filters === undefined) {
      return (<div>
        <Paper>
          Filters
        </Paper>
      </div>);
    }
    return (<div>
      <Paper>
        Filters
        {Object.keys(filters).map((filter) => (
          <div key={filter}>
            <div style={{textAlign: 'left', paddingLeft: 10}}>
              {filter[0].toUpperCase().concat(filter.substring(1)).concat(':')}
            </div>

            <List>
              {Object.keys(filters[filter]).sort().map((optionKey) => (
                <ListItem key={optionKey} onClick={
                  () => updateFilter(
                      filter,
                      optionKey,
                      !filters[filter][optionKey],
                  )
                }
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
            </List>
          </div>
        ))}
      </Paper>
    </div>);
  }
}

export default Filters;

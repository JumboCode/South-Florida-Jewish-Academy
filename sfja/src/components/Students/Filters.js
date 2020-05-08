import React from 'react';
import {Checkbox, List, ListItem, ListItemIcon, Paper} from '@material-ui/core';

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
                }>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={filters[filter][optionKey]}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{'aria-labelledby': optionKey}}
                    />
                    {optionKey}
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

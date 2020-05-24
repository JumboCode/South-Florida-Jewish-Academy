/* eslint-disable max-len,require-jsdoc,react/prop-types */
import React from 'react';
import {
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  Switch,
} from '@material-ui/core';
import {withCookies} from 'react-cookie';
import ScaleText from 'react-scale-text';

class ResendForms extends React.Component {
  constructor(props) {
    console.log('constructor, props', props);
    super(props);
    this.state = {
      openDialog: false,
      selected: null,
      blankForms: this.cleanBlankForms(props.blankForms),
    };
  }
  setSelected(newVal) {
    this.setState({selected: newVal});
  }
  setOpenDialog(newVal) {
    this.setState({openDialog: newVal});
  }

  cleanBlankForms(blankForms) {
    return blankForms.map((form) => ({id: form.id, name: form.name, checked: false}));
  };

  updateFormChecked(formId, newVal) {
    const {blankForms} = this.state;
    this.setState({
      blankForms: blankForms.map((form) => (formId === form.id ? {id: form.id, name: form.name, checked: newVal} : form)),
    });
  };

  render() {
    const {openDialog, selected, blankForms} = this.state;
    const {setShowSelectors, showSelectors, studentsChecked} = this.props;
    return (
      <Paper
        style={{marginTop: 20, height: 120}}
      >
        <div>
          Resend Forms
        </div>
        <div>
          <Switch
            checked={showSelectors}
            onChange={(event) => setShowSelectors(event.target.checked)}
            name='resend form mode'
          />
        </div>
        <Button
          onClick={() => this.setOpenDialog(true)}
          variant='contained'
          disabled={!showSelectors}
        >
          Resend Forms
        </Button>
        { showSelectors && <div style={{paddingTop: 10}}>
          Selected {studentsChecked.size} student{studentsChecked.size === 1 ? '' : 's'}.
        </div>}
        <Dialog
          open={openDialog}
          onClose={() => this.setOpenDialog(false)}
        >
          <DialogTitle>
            Resend Forms
          </DialogTitle>
          <DialogContent>
            <Paper
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: 20,
                margin: 20,
              }}
            >
              <Paper
                style={{margin: 20, padding: 20}}
              >
                <List>
                  {/* eslint-disable-next-line react/prop-types */}
                  {blankForms.map((form) => (<ListItem
                    key={form.id}
                    onClick={() => this.updateFormChecked(form.id, !form.checked)}
                    onMouseEnter={() => this.setSelected(form.id)}
                    onMouseLeave={() => this.setSelected(null)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selected === form.id ?
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
              </Paper>
              <br/>
              <Paper
                style={{margin: 20, padding: 20}}
              >
              </Paper>
            </Paper>
          </DialogContent>
        </Dialog>
      </Paper>
    );
  }
};

export default withCookies(ResendForms);

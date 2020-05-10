import React from 'react';
import apiUrl from '../../utils/Env';
import SnackBarMessage from '../../utils/SnackBarMessage';
import {Button} from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import {saveAs} from 'file-saver';
import {Cookies, withCookies} from 'react-cookie';
import {instanceOf} from 'prop-types';

const textSize = {
  fontSize: '13px',
};

class DocumentUpload extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      files: null,
      files2: null,
      openSuccessMessage: false,
    };
  }
  componentDidMount() {
    const {studentId} = this.props;
    fetch(apiUrl() + '/getFiles?studentId='+ studentId, {
      method: 'POST',
    })
        .then((res) => res.json())
        .then((data) => {
          this.setState({
            files2: data.files,
          });
        })
        .catch(console.log);
  }

  handleImageUpload() {
    const {files}= this.state;
    const {studentId} = this.props;
    console.log(files);
    if (files === null || files.length !== 1 ) {
      return;
    }
    const formData = new FormData();
    console.log(files);
    formData.append('file', files[0]);

    fetch(apiUrl() + '/saveImage?studentId='+ studentId, {
      method: 'POST',
      body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.setState({
            files2: data.files,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    document.getElementById('fileUpload').value = '';
    this.setState({openSuccessMessage: true});
  }

  downloadData(file_id, file_name) {
    const {cookies} = this.props;
    const body = {
      file_id: file_id,
      file_name: file_name
    };
    fetch(apiUrl() + '/downloadFile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify(body),
    }).then((response) => (response.blob()))
        .then((blob) => {
          saveAs(blob, file_name);
        });
  }

  render() {
    console.log(this.state);
    const {openSuccessMessage, files, files2} = this.state;

    return (
      <div>
                DocumentUpload Page
        <Button
          variant="contained"
          component="label"
        >
          Choose File
          <input type="file" id="fileUpload" style={{ display: "none" }} onChange={(e)=>{
            this.setState({files: e.target.files});
          }}/>
        </Button>
        <Button component="label" variant="contained" disabled={files === null || files.length !== 1 }onClick={this.handleImageUpload.bind(this)}>
                  Upload!
        </Button>

        {files2 != null ? (
          <TableContainer component={Paper}>
            <Table size = 'large'>
              <TableHead>
                <TableRow >
                  <TableCell style={textSize} align = "left" >File Name</TableCell>
                  <TableCell style={textSize} align = "left" >File ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files2.map((file) => (
                  <TableRow key={file['file_id']}>
                    <TableCell style={textSize} align = "left" onClick={()=> {this.downloadData(file['file_id'],file['file_name'])}}>{file['file_name']}</TableCell>
                    <TableCell style={textSize} align = "left" >{file['file_id']}</TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </TableContainer>
        ): null
        }


        <SnackBarMessage
          open={openSuccessMessage}
          closeSnackbar={() => this.setState({openSuccessMessage: false})}
          message={'File Successfully Uploaded'}
          severity='success'
        />


      </div>

    );
  }
}

export default withCookies(DocumentUpload);

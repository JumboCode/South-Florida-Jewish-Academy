import React from 'react';
import apiUrl from '../../utils/Env';

class DocumentUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          files: null
        };
      }
    handleImageUpload(){
        const {files}= this.state
        console.log(files)
        if (files === null && files.length !== 1 ){
            return
        }
        const formData = new FormData()
            console.log(files)
            formData.append('file', files[0])
          
            fetch(apiUrl() + '/saveImage', {
              method: 'POST',
              body: formData
            })
            .then(response => response.json())
            .then(data => {
              console.log(data)
            })
            .catch(error => {
              console.error(error)
            })
    }
    render(){
        // const handleImageUpload = event => {
        //     const files = event.target.files
        //     const formData = new FormData()
        //     console.log(files)
        //     formData.append('myFile', files[0])
          
        //     fetch('/saveImage', {
        //       method: 'POST',
        //       body: formData
        //     })
        //     .then(response => response.json())
        //     .then(data => {
        //       console.log(data)
        //     })
        //     .catch(error => {
        //       console.error(error)
        //     })
        //   }
        console.log(this.state)
        return(
            <div>
                DocumentUpload Page
                <input type="file" id="fileUpload" onChange={e=>{this.setState({files:e.target.files})}}/>
                <button onClick={this.handleImageUpload.bind(this)}> 
                  Upload! 
                </button> 
                 
            </div>
            
        );
    }
}

export default DocumentUpload;

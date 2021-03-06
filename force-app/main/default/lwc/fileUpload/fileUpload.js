import {
    LightningElement,
    api
} from 'lwc';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';

export default class FileUpload extends LightningElement {
    @api myRecordId;

    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    handleUploadFinished(event) {
        //Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        let uploadedFileNames = '';
        for (let i = 0; i < uploadedFiles.length; i++) {
            uploadedFileNames += uploadedFiles[i].name + ', ';
        }
        this.dispatchEvent(new CustomEvent('newfileupload'));
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: uploadedFiles.length + ' Files uploaded Successfully : ' + uploadedFileNames,
            variant: 'success'
        }))
    }
}
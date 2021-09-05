import {
    LightningElement,
    track,
    api
} from 'lwc';
import getFilesOnLoad from '@salesforce/apex/FileUploadRelatedListController.getRelatedFiles';

const columns = [{
    /*label: "File Name",
    fieldName: "fileUrl",
    sortable: true,
    type: "url",
    initialWidth: 500,
    wrapText: true,
    typeAttribute: {
        label: {
            fieldName: "fileName"
        }
    }*/
    label: "File Name",
    fieldName: "fileName",
    sortable: true,
    initialWidth: 300,
    wrapText: true
}, {
    label: "File Url",
    fieldName: "fileUrl",
    sortable: true,
    type: "url",
    initialWidth: 300,
    wrapText: true
}, {
    label: "Created Date",
    fieldName: "createdDate",
    sortable: true,
    initialWidth: 150
}, {
    label: "Owner",
    fieldName: "ownerName",
    sortable: true,
    initialWidth: 300
}, {
    label: "File Type",
    fieldName: "fileType",
    sortable: true,
    wrapText: true,
    initialWidth: 100
}];

export default class FileUploadRelatedList extends LightningElement {
    @api recordId;
    data;
    columns = columns;
    defaultSortDirection = 'asc';
    sortedDirection = 'asc';
    sortedBy;

    connectedCallback() {
        console.log('recordId---' + this.recordId);
        getFilesOnLoad({
            recordId: this.recordId
        }).then(result => {
            this.data = result;
        }).catch(error => {
            console.log('Error--' + error);
        })
    }


    onHandleSort(event) {
        console.log('onHandleSort detail----' + JSON.stringify(event.detail));
        const {
            fieldName: sortedBy,
            sortDirection
        } = event.detail;

    }

    refreshList() {
        getFilesOnLoad({
            recordId: this.recordId
        }).then(result => {
            this.data = result;
        }).catch(error => {
            console.log('Error--' + error);
        })
    }
}
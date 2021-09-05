import {
    LightningElement,
    track,
    api
} from 'lwc';
import getFilesOnLoad from '@salesforce/apex/FileUploadRelatedListController.getRelatedFiles';
import searchFilesContent from '@salesforce/apex/FileUploadRelatedListController.searchFilesContent';
import {
    showToastEvent
} from 'lightning/platformShowToastEvent';

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
    searchFileName;
    @track filesToDisplay;
    searchContains;
    allFileIdList;
    allFieldSearchResult;

    connectedCallback() {
        console.log('recordId---' + this.recordId);
        getFilesOnLoad({
            recordId: this.recordId
        }).then(result => {
            this.data = this.filesToDisplay = result;
            this.allFileIdList = [];
            for (let i = 0; i < this.data.length; i++) {
                this.allFileIdList.push(this.data[i].fileId);
            }
        }).catch(error => {
            console.log('Error--' + error);
        })
    }


    onHandleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        try {
            this.sortData(this.sortedBy, this.sortDirection);
        } catch (err) {
            console.log('error while sorting ---' + err);
        }
    }

    sortData(fieldName, direction) {
        let parseData = JSON.parse(JSON.stringify(this.filesToDisplay));
        let getField = fieldName;

        //Return the value sorted in the field
        let keyValue = (a) => {
            return a[getField];
        };
        //checking reverse direction
        let isReverse = direction === 'asc' ? 1 : -1;
        //sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; //handling null values
            y = keyValue(y) ? keyValue(y) : '';
            let a = x.toLowerCase();
            let b = y.toLowerCase();

            return isReverse * ((a > b) - (b > a));
        });
        this.filesToDisplay = parseData;
    }

    refreshList() {
        this.searchFileName = '';
        getFilesOnLoad({
            recordId: this.recordId
        }).then(result => {
            this.data = this.filesToDisplay = result;
            this.allFileIdList = [];
            for (let i = 0; i < this.data.length; i++) {
                this.allFileIdList.push(data[i].fileId);
            }
        }).catch(error => {
            console.log('Error--' + error);
        })
    }

    handleFileNameSearch(event) {
        this.searchFileName = event.detail.value;
        this.filterFiles();
    }

    filterFiles() {
        this.filesToDisplay = [];
        for (let i = 0; i < this.data.length; i++) {
            let fileMatch = true;

            let fileName = this.data[i].fileName.toLowerCase();

            if (this.searchFileName && !fileName.includes(this.searchFileName.toLowerCase()) ||
                (this.searchContains && !this.allFieldSearchResult.includes(this.data[i].fileId))) {
                fileMatch = false;
            }
            if (fileMatch) {
                this.filesToDisplay.push(this.data[i]);
            }
        }
    }

    handleContainsSearch(event) {
        this.searchContains = event.target.value;
        if (this.searchContains.length > 1 && this.allFileIdList.length > 0) {
            let searchKeyWords = this.searchContains.split('+');
            searchFilesContent({
                searchArray: searchKeyWords,
                validDocIdList: this.allFileIdList
            }).then((result) => {
                this.allFieldSearchResult = result;
                this.filterFiles();
            }).catch((error) => {
                let errorMessage = 'Failed to search files content';
                if (error.body) {
                    if (Array.isArray(error.body)) {
                        errorMessage = error.body.map((e) => e.message).join(', ');
                    } else if (typeof error.body.message === 'string') {
                        errorMessage = error.body.message;
                    }
                }
                const toastEvent = new ShowToastEvent({
                    message: errorMessage,
                    variant: 'error'
                });
                this.dispatchEvent(toaseEvent);
            });
        } else {
            this.allFieldSearchResult = [];
            this.filterFiles();
        }
    }
}
import {
    createElement
} from 'lwc';
import FileUpload from 'c/fileUpload';
import {
    ShowToastEventName
} from 'lightning/platformShowToastEvent';

const RECORD_ID = '5002w00000K46zxAAB';
const TOAST_TITLE = 'Success';

describe('c-file-upload test suite', () => {
    beforeEach(() => {
        const element = createElement('c-file-upload', {
            is: FileUpload
        });
        element.recordId = RECORD_ID;
        document.body.appendChild(element);
    });
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    })

    it('File upload component should be rendered', () => {
        const element = document.querySelector('c-file-upload');
        const fileUploadElement = element.shadowRoot.querySelector('lightning-file-upload');
        expect(fileUploadElement).not.toBeNull();
    })

    it('Component should have record id',()=> {
        const element = document.querySelector('c-file-upload');
        expect(element.recordId).toBe(RECORD_ID);
    })

    it('Test on file upload finished',()=>{
        const element = document.querySelector('c-file-upload');
        const fileUploadElement = element.shadowRoot.querySelector('lightning-file-upload');
        const handler = jest.fn();
        element.addEventListener(ShowToastEventName, handler);
        fileUploadElement.dispatchEvent(new CustomEvent('uploadfinished',{
            detail: {
                files: [
                    {
                        name: 'Test Screenshot.png',
                        documentId: '0692000000hQ6hAW',
                        contentVersionId: '0682000000hmhuQAQ'
                    }
                ]
            }
        }));
        return Promise.resolve().then(()=>{
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail.title).toBe(TOAST_TITLE);
        })
    })
})
Add the FileUploadRelatedList to the related list of lightning app page of any record, so that it fetches the record id it wanted.
Use package.xml for component list and deployment

* Also contains logic for fileName search and content search using sosl query
* Contains datatable sorting logic

JEST Testing for TOAST Functionality :
Imp Notes----
1. Create platformShowToastEvent.js as it is in repo, It is present in force-app>tests>jest-mocks>lightning>platformShowToastEvent.js
2. Update the jest.config.js file moduleNameMapper with correct lightning/platformShowToastEvent$ or copy as it is
3. Run the tests for toast functionality

Added mock for messageService just like platformShowToastEvent
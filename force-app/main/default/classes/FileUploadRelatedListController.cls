public with sharing class FileUploadRelatedListController {
    @AuraEnabled
    public static List<FilesDataWrapper> getRelatedFiles(Id recordId){
        try {
            String filesDataString = '';

            //if there are any emails associated to record(Particularly Case) then we need to get any documents that are sent as attachment on the email
            List<emailMessage> emailMsgList = new List<emailMessage>();
            if(emailMessage.sObjectType.getDescribe().isQueryable()){
                emailMsgList = [SELECT Id FROM emailMessage WHERE ParentId =: recordId];
            }

            Set<Id> linkedEntityIdList = new Set<Id>();
            linkedEntityIdList.add(recordId);
            for(emailMessage msg: emailMsgList){
                linkedEntityIdList.add(msg.Id);
            }

            List<ContentDocumentLink> docList = new List<ContentDocumentLink>();
            if(ContentDocumentLink.sObjectType.getDescribe().isQueryable()){
                docList = [SELECT
                ContentDocument.title,
                ContentDocument.CreatedDate,
                ContentDocument.Owner.Name,
                ContentDocument.FileExtension,
                ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId IN: linkedEntityIdList ORDER By ContentDocument.CreatedDate DESC,
                ContentDocument.title ASC, ContentDocument.FileExtension ASC];
            }
            List<FilesDataWrapper> tempDataList = new List<FilesDataWrapper>();
            String baseUrl = URL.getSalesforceBaseUrl().toExternalForm();
            for(ContentDocumentLink doc : docList){
                FilesDataWrapper tempData = new FilesDataWrapper();
                tempData.fileUrl = baseUrl + '/' + doc.ContentDocumentId;
                tempData.fileName = doc.ContentDocument.title;
                tempData.fileType = doc.ContentDocument.FileExtension;
                tempData.createdDate = date.valueOf(doc.ContentDocument.CreatedDate);
                tempData.ownerName = doc.ContentDocument.Owner.Name;
                tempData.fileId = doc.ContentDocumentId;
                tempDataList.add(tempData);
            }

            return tempDataList;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<String> searchFilesContent(List<String> searchArray, List<Id> validDocIdList){
        try {
            String searchString = '';
            Boolean keyWordSearch = false;
            for(String key: searchArray){
                key = String.escapeSingleQuotes(key);
                if(searchString.length() == 0){
                    searchString = key;
                } else {
                    keyWordSearch = true;
                    searchString += ' AND '+'"'+key+'"';
                }
            }

            if(!keyWordSearch){
                searchString = '\''+searchString+'*'+'\'';
            } else {
                searchString = '{'+searchString+'}';
            }

            String searchQuery = 'FIND '+searchString+ ' IN All FIELDS RETURNING ContentDocument(Id where Id in: validDocIdList)';
            List<List<SObject>> searchList = search.query(searchQuery);
            List<String> returnValidDocList = new List<String>();
            for(List<SObject> sl : searchList){
                List<ContentDocument> cdList = new List<ContentDocument>();
                cdList = (List<ContentDocument>)sl;
                for(ContentDocument cd : cdList){
                    returnValidDocList.add(cd.Id);
                }
            }
            return returnValidDocList;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}

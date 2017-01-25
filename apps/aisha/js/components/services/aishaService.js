﻿(function () {
    'use strict';
    angular.module('aisha.services.aishaService', ['aisha.common', 'aisha.services.baseService'])    
    .factory('aishaService', ['$http', '$q', 'appCommon', function ($http, $q, appCommon) {
        /* ---------------------------- constructor -------------------------------- */
        var aishaService = function () {
            //this._siteUrl = _spPageContextInfo.webAbsoluteUrl;
            this._siteUrl = '';
            this._digest = $("#__REQUESTDIGEST").val();
        }
        
        /* ---------------------------- global properties & functions -------------- */
        //var siteUrl = _spPageContextInfo.webAbsoluteUrl;
        var siteUrl = '';

        var extendProperties = function (item) {
            var model = new Object();
            if (item.length != null) {
                model.length = item.length;
            }
            for (var key in item) {
                if (item.hasOwnProperty(key)) {
                    var property = key.charAt(0).toLowerCase() + key.slice(1);
                    model[property] = item[key];

                    if (angular.isObject(item[key])) {
                        var oldItem = item[key];
                        var newItem = extendProperties(oldItem);
                        model[property] = newItem;
                    }
                }
            }
            return model;
        };
                   
        var getItemTypeForListTitle = function (name) {
            return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
        }
        
        /* ---------------------------- User & Permission -------------------------- */
        aishaService.prototype.getCurrentUserWithDetails = function () {
            var url = String.format("{0}/_api/web/currentuser/?$expand=groups", siteUrl);

            var q = $q.defer();
            $http({
                url: url,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json;odata=verbose",
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                }
            }).success(function (result) {
                if (result.d.Groups.results.length == 0) {
                    var group = { Title: 'CEP General' };
                    result.d.Groups.results.push(group);
                };
                q.resolve(result.d.Groups.results);
            }).error(function (result, status) {
                q.reject(status);
            });
            return q.promise;
        };
        
        /* ---------------------------- Feedback Template -------------------------- */
        aishaService.prototype.createFeedbackTemplate = function (listTitle, feedbackTemplate) {
            var itemType = getItemTypeForListTitle(listTitle);
            var item = {
                "__metadata": { "type": itemType },
                "Title": feedbackTemplate.title,
                "FeedbackTemplateTitle": feedbackTemplate.title,
                "FeedbackTemplateName": feedbackTemplate.name,
                "Section01": feedbackTemplate.section01,
                "Section02": feedbackTemplate.section02,
                "Section03": feedbackTemplate.section03,
                "Section04": feedbackTemplate.section04,
                "Section05": feedbackTemplate.section05
            };

            // call REST API
            var q = $q.defer();
            var self = this;
            self.createItem(siteUrl, listTitle, item).then(function (result) {
                q.resolve(result);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.editFeedbackTemplate = function (listTitle, feedbackTemplate) {
            var itemType = getItemTypeForListTitle(listTitle);
            var item = {
                "__metadata": { "type": itemType },
                "Id": feedbackTemplate.id,
                "Title": feedbackTemplate.title,
                "FeedbackTemplateTitle": feedbackTemplate.title,
                "FeedbackTemplateName": feedbackTemplate.name,
                "Section01": feedbackTemplate.section01,
                "Section02": feedbackTemplate.section02,
                "Section03": feedbackTemplate.section03,
                "Section04": feedbackTemplate.section04,
                "Section05": feedbackTemplate.section05
            };

            // call REST API
            var q = $q.defer();
            var self = this;
            self.editItem(siteUrl, listTitle, item).then(function (result) {
                q.resolve(result);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.deleteFeedbackTemplate = function (listTitle, itemId) {
            // call REST API
            var q = $q.defer();
            var self = this;
            self.deleteItem(siteUrl, listTitle, itemId).then(function (result) {
                q.resolve(result);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.getFeedbackTemplateById = function (listTitle, itemId) {
            if (itemId == undefined) {
                itemId = 1
            }
            // call REST API
            var q = $q.defer();
            var self = this;
            self.getData(siteUrl, listTitle, itemId).then(function (result) {
                var template = {};
                if (result.d.results.length > 0) {
                    template = extendProperties(result.d.results[0]);
                    template.name = template.feedbackTemplateName;
                    template.title = template.feedbackTemplateTitle;
                }
                q.resolve(template);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }
        
        /* ---------------------------- Feedback Options --------------------------- */
        aishaService.prototype.createFeedbackOption = function (listTitle, feedbackOption) {
            var itemType = getItemTypeForListTitle(listTitle);
            var item = {
                "__metadata": { "type": itemType },
                "Title": feedbackOption.title,
                "FeedbackDescription": feedbackOption.description
            };

            // call REST API
            var q = $q.defer();
            var self = this;
            self.createItem(siteUrl, listTitle, item).then(function (result) {
                q.resolve(result);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.editFeedbackOption = function (listTitle, feedbackOption) {
            var itemType = getItemTypeForListTitle(listTitle);
            var item = {
                "__metadata": { "type": itemType },
                "Id": feedbackOption.id,
                "Title": feedbackOption.title,
                "FeedbackDescription": feedbackOption.description
            };

            // call REST API
            var q = $q.defer();
            var self = this;
            self.editItem(siteUrl, listTitle, item).then(function (result) {
                q.resolve(result);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.deleteFeedbackOption = function (listTitle, itemId) {
            // call REST API
            var q = $q.defer();
            var self = this;
            self.deleteItem(siteUrl, listTitle, itemId).then(function (result) {
                q.resolve(result);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.getFeedbackOption = function (listTitle) {
            // call REST API
            var q = $q.defer();
            var self = this;
            self.getData(siteUrl, listTitle).then(function (result) {
                var data = [];
                if (result.d.results.length > 0) {
                    angular.forEach(result.d.results, function (item) {
                        var model = extendProperties(item);
                        model.description = model.feedbackDescription;
                        model.deleted = false;
                        model.checked = false;
                        data.push(model);
                    });
                }
                q.resolve(data);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }
        
        /* ---------------------------- Feedback Questions ------------------------- */
        aishaService.prototype.createFeedbackQuestion = function (listTitle, feedbackQuestion) {
            var itemType = getItemTypeForListTitle(listTitle);
            var item = {
                "__metadata": { "type": itemType },
                "Title": feedbackQuestion.title,
                "FeedbackDescription": feedbackQuestion.description
            };

            // call REST API
            var q = $q.defer();
            var self = this;
            self.createItem(siteUrl, listTitle, item).then(function (result) {
                q.resolve(result);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.editFeedbackQuestion = function (listTitle, feedbackQuestion) {            
            var url = siteUrl;
            var itemType = getItemTypeForListTitle(listTitle);
            var item = {
                "__metadata": { "type": itemType },
                "Id": feedbackQuestion.id,
                "Title": feedbackQuestion.title,
                "FeedbackDescription": feedbackQuestion.description
            };

            // call REST API
            var q = $q.defer();
            var self = this;
            self.editItem(url, listTitle, item).then(function (result) {
                q.resolve(result);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.deleteFeedbackQuestion = function (listTitle, itemId) {
            // call REST API
            var q = $q.defer();
            var self = this;
            self.deleteItem(siteUrl, listTitle, itemId).then(function (result) {
                q.resolve(result);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.getFeedBackQuestion = function (listTitle) {
            // call REST API
            var q = $q.defer();
            var self = this;
            self.getData(siteUrl, listTitle).then(function (result) {
                var data = [];
                if (result.d.results.length > 0) {
                    angular.forEach(result.d.results, function (item) {
                        var model = extendProperties(item);
                        model.description = model.feedbackDescription;
                        model.deleted = false;
                        model.checked = false;
                        data.push(model);
                    });
                }
                q.resolve(data);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }
        
        /* ---------------------------- Feedback ----------------------------------- */
        aishaService.prototype.createFeedback = function (listTitle, feedback) {
            var itemType = getItemTypeForListTitle(listTitle);
            var item = {
                "__metadata": { "type": itemType },
                "Title": feedback.title,
                "SuggestionType": feedback.suggestionType,
                "FeedbackDescription": feedback.feedbackDescription,
                "FeedbackAnswer": feedback.feedbackAnswer,
                "FeedbackLink": {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': feedback.feedbackLink.description,
                    'Url': feedback.feedbackLink.url
                },
                "Browser": feedback.browser,
                "OperatingSystem": feedback.operatingSystem,
                "MobileDevice": feedback.mobileDevice,
                "ScreenSize": feedback.screenSize,
                "FeedbackStatus": feedback.feedbackStatus,
                "FeedbackResponse": feedback.feedbackResponse,
            };

            // call REST API
            var q = $q.defer();
            var self = this;
            self.createItem(siteUrl, listTitle, item).then(function (result) {
                var data = extendProperties(result.d);
                q.resolve(data);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        };

        aishaService.prototype.editFeedback = function (listTitle, feedback) {
            var url = siteUrl;
            var itemType = getItemTypeForListTitle(listTitle);
            var item = {
                "__metadata": { "type": itemType },
                "Title": feedback.title,
                "FeedbackDescription": feedback.feedbackDescription,
                "Answer01": feedback.answer01,
                "Answer02": feedback.answer02,
                "Answer03": feedback.answer03,
                "Answer04": {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': feedback.answer04.description,
                    'Url': feedback.answer04.url
                },
            };

            // call REST API
            var q = $q.defer();
            var self = this;
            self.editItem(url, listTitle, item).then(function (result) {
                q.resolve(result);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.deleteFeedback = function (listTitle, itemId) {
            // call REST API
            var q = $q.defer();
            var self = this;
            self.deleteItem(siteUrl, listTitle, itemId).then(function (result) {
                q.resolve(result);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.getFeedBack = function (listTitle) {
            // call REST API
            var q = $q.defer();
            var self = this;
            self.getData(siteUrl, listTitle).then(function (result) {
                var data = [];
                if (result.d.results.length > 0) {
                    angular.forEach(result.d.results, function (item) {
                        var model = extendProperties(item);
                        data.push(model);
                    });
                }
                q.resolve(data);
            }, function (error) {
                q.reject(error);
            });
            return q.promise;
        }
        
        /* ---------------------------- base functions ----------------------------- */
        aishaService.prototype.getData = function (siteUrl, listTitle) {                
            var listGuid = appCommon.getListIdByListTitle(listTitle);
            var url = String.format("{0}/_api/web/lists(guid'{1}')/items", siteUrl, listGuid);

            var q = $q.defer();
            $http({
                url: url,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json;odata=verbose",
                    "Accept": "application/json;odata=verbose"
                }
            }).success(function (result) {
                q.resolve(result);
            }).error(function (error, status) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.getItemById = function (siteUrl, listTitle, itemId) {                
            var listGuid = appCommon.getListIdByListTitle(listTitle);
            var url = String.format("{0}/_api/web/lists(guid'{1}')/items?$filter=Id eq {2}", siteUrl, listGuid, itemId);

            var q = $q.defer();
            $http({
                url: url,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json;odata=verbose",
                    "Accept": "application/json;odata=verbose"
                }
            }).success(function (result) {
                q.resolve(result.d.results[0]);
            }).error(function (error, status) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.createItem = function (siteUrl, listTitle, item) {                
            var listGuid = appCommon.getListIdByListTitle(listTitle);
            var url = String.format("{0}/_api/web/lists(guid'{1}')/items", siteUrl, listGuid);

            var q = $q.defer();
            $http({
                url: url,
                method: 'POST',
                data: JSON.stringify(item),
                headers: {
                    "Content-Type": "application/json;odata=verbose",
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                }
            }).success(function (result) {
                q.resolve(result);
            }).error(function (error, status) {
                q.reject(error);
            });
            return q.promise;
        }

        aishaService.prototype.editItem = function (siteUrl, listTitle, item) {
            var q = $q.defer();
            var self = this;
            // update list item by id
            self.getItemById(siteUrl, listTitle, item.Id).then(function (data) {
                // update list item
                $http({
                    url: data.__metadata.uri,
                    method: 'POST',
                    data: JSON.stringify(item),
                    headers: {
                        "Content-Type": "application/json;odata=verbose",
                        "Accept": "application/json;odata=verbose",
                        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                        "X-HTTP-Method": "MERGE",
                        "If-Match": data.__metadata.etag
                    }
                }).success(function (result) {
                    q.resolve(true);
                }).error(function (error, status) {
                    q.reject(error);
                });
            }, function (error, status) {
                q.reject(status);
            });
            return q.promise;
        }

        aishaService.prototype.deleteItem = function (siteUrl, listTitle, itemId) {                
            var listGuid = appCommon.getListIdByListTitle(listTitle);
            var url = String.format("{0}/_api/web/lists(guid'{1}')/items({2})", siteUrl, listGuid, itemId);

            var q = $q.defer();
            $http({
                url: url,
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json;odata=verbose",
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "If-Match": "*"
                }
            }).success(function (result) {
                q.resolve(result);
            }).error(function (error, status) {
                q.reject(error);
            });
            return q.promise;
        };

        aishaService.prototype.uploadFiles = function (uri, files) {
            // You can upload files up to 2 GB with the REST API.
            var length = files.length,
                i = 0,
                self = this,
                deferred = $q.defer();

            function next(i) {
                self.attachFileToList(uri, files[i].name, files[i].binaryData).then(function () {
                    i = i + 1;
                    var file = files[i];
                    if (file) {
                        next(i);
                    } else {
                        deferred.resolve('done');
                    }
                });
            }
            next(i);
            return deferred.promise;
        };

        aishaService.prototype.attachFileToList = function (uri, fileName, data) {
            var url = String.format("{0}/AttachmentFiles/add(FileName='{1}')", uri, fileName);
            var deferred = $q.defer();
            $http({
                url: url,
                method: 'POST',
                async: false,
                processData: false,
                binaryStringRequestBody: true,
                transformRequest: [],
                data: data,
                headers: {
                    'accept': 'application/json;odata=verbose',
                    'X-RequestDigest': $("#__REQUESTDIGEST").val(),
                    'content-Type': 'application/json;odata=verbose'
                }
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (result, status) {
                deferred.reject(status);
            });
            return deferred.promise;
        };

        return new aishaService;
    }])    
})();
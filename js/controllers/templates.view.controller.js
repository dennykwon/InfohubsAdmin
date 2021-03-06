var templatesViewController = angular.module('templates.view.controller', []);

templatesViewController.controller('templatesViewController', ['$scope', '$http', 'restService', function($scope, $http, restService) {
		$scope.loading = false;
		$scope.templates = null;
		$scope.currentTemplateName = null;
		$scope.currentTemplate = null;
		$scope.newTemplate = {'name':'', 'css':'', 'html':''};
    	
	
    	$scope.init = function() {
        	$scope.loading = true;
        	$scope.requestType = 'getTemplates';
        	restService.getResource('templates', null, null).success(requestSuccessHandler).error(requestFailHandler);
    	}
    	

        $scope.changeCurrentTemplate = function(){
        	for (var i=0; i<$scope.templates.length; i++){
        		var template = $scope.templates[i];
        		if (template.name == $scope.currentTemplateName){
        			$scope.currentTemplate = template;
        			break;
        		}
        	}
        }
        

        $scope.templateNames = function(){
        	var names = new Array();
        	if ($scope.templates==null)
        		return names;
        	
        	for (var i=0; i<$scope.templates.length; i++){
        		var template = $scope.templates[i];
        		names.push(template.name);
        	}
        	
        	return names;
        }
        
        $scope.previewTemplate = function(){
        	var url = 'http://www.google.com';
        	
        	popup(url, 691, 691);
        	popup(url, 315, 315);
        	popup(url, 315, 370);
        	popup(url, 315, 691);
        }
        

        
        function popup(url, w, h) {
    		dimensions = 'height='+h+',width='+w;
    	  	newwindow = window.open(url,'',dimensions);

    	  	if (window.focus) {
    	  		newwindow.focus();
    	  	}
    	  	
    	  	return false;
        }
        
        
        
// - - - - - - - - - - - - - - - - - - - - CRUD  - - - - - - - - - - - - - - - - - - - - 
        
        $scope.createTemplate = function(){
        	if ($scope.newTemplate.name.length < 1){
        		alert('Please Enter a Valid Name for the Template.');
        		return;
        	}
        	
        	console.log('Create Template: '+JSON.stringify($scope.newTemplate));
        	$scope.loading = true;
        	$scope.requestType = 'createTemplate';
        	restService.postResource('templates', $scope.newTemplate, null).success(requestSuccessHandler).error(requestFailHandler);
        }
        
        $scope.updateCurrentTemplate = function(){
        	if ($scope.currentTemplate==null)
        		return;
        	
        	$scope.loading = true;
        	$scope.requestType = 'updateTemplate';
        	restService.putResource('templates', $scope.currentTemplate, null).success(requestSuccessHandler).error(requestFailHandler);
        }
        

        $scope.deleteCurrentTemplate = function(){
        	if ($scope.currentTemplate==null)
        		return;

        	console.log('deleteCurrentTemplate');
        	$scope.loading = true;
        	$scope.requestType = 'deleteTemplate';
        	restService.deleteResource('templates', $scope.currentTemplate, null).success(requestSuccessHandler).error(requestFailHandler);

        }
        

        

// - -  - -  - -  - -  - -  - - NETWORK SUCCESS/FAIL HANDLERS - -  - -  - -  - -  - -  - -  - -  - - 

        function requestSuccessHandler(data, status, headers, config){
        	$scope.loading = false;
            if (data.results.confirmation == 'success') {
        		console.log('REQUEST SUCCESS HANDLER');
            	console.log(JSON.stringify(data.results));
            	
            	if ($scope.requestType == 'getTemplates'){
                	$scope.templates = data.results.templates;
                	$scope.currentTemplate = $scope.templates[0];
                	$scope.currentTemplateName = $scope.currentTemplate.name;
                	return;
            	}

            	if ($scope.requestType == 'createTemplate'){
            		$scope.newTemplate = {'name':'', 'css':'', 'html':''};
            		var template = data.results.template;
            		$scope.templates.unshift(template);        		
                	
                	alert('Template Successfully Created');
                	return;
            	}

            	if ($scope.requestType == 'updateTemplate'){
                	console.log(JSON.stringify(data.results));
                	alert('Template Successfully Updated');
                	return;
            	}
            	

            	if ($scope.requestType == 'deleteTemplate'){
                	console.log(JSON.stringify(data.results));
                	alert('Template Successfully Deleted');
                	
                	var index = $scope.templates.indexOf($scope.currentTemplate);
                	if (index > -1) {
                		$scope.templates.splice(index, 1);
                		var i = (index+1) % $scope.templates.length;
                    	$scope.currentTemplate = $scope.templates[i];
                    	$scope.currentTemplateName = $scope.currentTemplate.name;
                	}
                	
                	return;
            	}



            } 
            
            // fail:
            alert(data.results.message);
        }

        function requestFailHandler(data, status, headers, config, requestId){
        	$scope.loading = false;
        }

        
        
        

    }
]);
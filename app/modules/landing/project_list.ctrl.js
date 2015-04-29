angular.module('diveApp.landing').controller("ProjectListCtrl", function($scope, $http, $state, $rootScope, AllProjectsService, UserService, API_URL) {
  var init;
  console.log("[CONTROLLER] Project List");
  init = function() {
    $scope.newProjectData = {};
    $scope.newProject = false;
    $scope.selectedProject = null;
    $scope.user = UserService.getCurrentUser(true);
    $scope.loggedIn = Boolean($scope.user.userName);
    $scope.loginErr = false;
    $scope.regErr = false;
    if ($scope.loggedIn) {
      return AllProjectsService.promise($scope.user.userName, function(projects) {
        console.log("Projects retrieved", projects);
        return $scope.projects = projects;
      });
    }
  };
  $scope.loginUser = function(userName, password) {
    if (userName && password) {
      return UserService.loginUser(userName, password, function(data) {
        if (data['success'] === 1) {
          $scope.loggedIn = true;
          $scope.user = UserService.getCurrentUser();
          AllProjectsService.promise($scope.user.userName, function(projects) {
            return $scope.projects = projects;
          });
        } else {
          return $scope.loginErr = true;
        }
      });
    } else {
      return $scope.loginErr = true;
    }
  };
  $scope.registerUser = function(userName, displayName, password) {
    if (userName && displayName && password) {
      return UserService.registerUser(userName, displayName, password, function(data) {
        if (data['success'] === 1) {
          return $scope.loginUser(userName, password);
        } else {
          return $scope.regErr = true;
        }
      });
    } else {
      return $scope.regErr = true;
    }
  };
  $scope.logoutUser = function() {
    return UserService.logoutUser(function() {
      $scope.user = UserService.getCurrentUser();
      return init();
    });
  };
  $scope.selectProject = function(pID) {
    if ($scope.selectedProject === pID) {
      return $scope.selectedProject = null;
    } else {
      return $scope.selectedProject = pID;
    }
  };
  $scope.openProject = function(project) {
    return $state.go('project.data.upload', {
      formattedUserName: $scope.user.userName,
      formattedProjectTitle: project.formattedTitle
    });
  };
  $scope.removeProject = function(project, index) {
    var pID;
    pID = project.pID;
    console.log('Removing project, pID:', pID);
    $scope.projects.splice(index, 1);
    return $http["delete"](API_URL + '/api/project', {
      params: {
        pID: pID
      }
    }).success(function(result) {
      return console.log("Deleted project pID", pID);
    });
  };
  $scope.newProjectToggle = function() {
    return $scope.newProject = !$scope.newProject;
  };
  return init();
});

// ---
// generated by coffee-script 1.9.0
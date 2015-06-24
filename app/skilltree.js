(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f
      }
      var l = n[o] = {
        exports: {}
      };
      t[o][0].call(l.exports, function(e) {
        var n = t[o][1][e];
        return s(n ? n : e)
      }, l, l.exports, e, t, n, r)
    }
    return n[o].exports
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s
})({
  1: [function(require, module, exports) {
    /* define our modules */
    angular.module('andelabs.services', ['firebase', 'ngCookies']);
    angular.module('andelabs.filters', []);
    angular.module("andelabs.directives", ['monospaced.elastic']);
    angular.module('andelabs.controllers', []);

    /* load services */
    require('./js/services/authentication.js');
    require('./js/services/authorization.js');
    require('./js/services/refs.js');
    require('./js/services/labs.js');
    require('./js/services/invites.js');
    require('./js/services/toast.js');
    require('./js/services/users.js');

    /* load directives */
    require('./js/directives/category-score.js');
    require('./js/directives/user-lab.js');

    /* load filters */
    require('./js/filters/objectfilter.js');

    /* load controllers */
    require('./js/controllers/bottom-sheet.js');
    require('./js/controllers/welcome.js');
    require('./js/controllers/home.js');
    require('./js/controllers/lab.js');
    require('./js/controllers/lab-admin.js');
    require('./js/controllers/invite.js');
    require('./js/controllers/join.js');
    require('./js/controllers/login.js');
    require('./js/controllers/user.js');

    window.Andelabs = angular.module("andelabs", [
      'ui.router',
      'andelabs.controllers',
      'andelabs.directives',
      'andelabs.filters',
      'andelabs.services',
      'ngAnimate',
      'ngMaterial',
      'ui.ace',
      'markdown',
      'ngSanitize'
    ]);

    Andelabs.run(['$rootScope', 'Authorization', 'Authentication', 'Refs', '$location', '$state', 'toast',
      function($rootScope, Authorization, Authentication, Refs, $location, $state, toast) {
        Refs.root.onAuth(Authentication.onAuth);
      }
    ]);

    /* application routes */
    Andelabs.config(['$stateProvider', '$locationProvider', '$mdThemingProvider',
      function($stateProvider, $locationProvider, $mdThemingProvider, markdownConfig) {

        $mdThemingProvider.theme('default')
          .primaryPalette('blue', {
            'default': '800', // by default use shade 400 from the pink palette for primary intentions
            'hue-1': '500', // use shade 100 for the <code>md-hue-1</code> class
            'hue-2': '200', // use shade 600 for the <code>md-hue-2</code> class
            'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
          })
          // If you specify less than all of the keys, it will inherit from the
          // default shades
          .accentPalette('orange', {
            'default': '400' // use shade 200 for default, and keep all other shades the same
          });

        $locationProvider.html5Mode(true);
        $stateProvider
          .state('admin/invite', {
            url: '/admin/invite',
            templateUrl: 'views/admin/invite.html',
            controller: 'InviteCtrl'
          })
          .state('admin/labs', {
            url: '/admin/labs',
            templateUrl: 'views/admin/labs.html',
            controller: 'LabAdminCtrl'
          })
          .state('admin/labs/id', {
            url: '/admin/labs/:labId',
            templateUrl: 'views/admin/labs.html',
            controller: 'LabAdminCtrl'
          })
          .state('admin/users', {
            url: '/admin/users',
            templateUrl: 'views/admin/users.html',
            controller: 'UserCtrl'
          })
          .state('admin/users/id', {
            url: '/admin/users/:userId',
            templateUrl: 'views/admin/users.html',
            controller: 'UserCtrl'
          })
          .state('default', {
            url: '/home',
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
          })
          .state('labs/id', {
            url: '/labs/:labId',
            templateUrl: 'views/labs.html',
            controller: 'LabCtrl'
          })
          .state('login', {
            url: '/',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
          })
          .state('join', {
            url: '/join',
            templateUrl: 'views/join.html',
            controller: 'JoinCtrl'
          })
          .state('join/id', {
            url: '/join/:joinId',
            templateUrl: 'views/join.html',
            controller: 'JoinCtrl'
          })
          .state('logout', {
            url: '/logout',
            controller: ['Authentication', '$state', function(Authentication, $state) {
              Authentication.logout();
              $state.go('login');
            }]
          });
      }
    ]);

  }, {
    "./js/controllers/bottom-sheet.js": 2,
    "./js/controllers/home.js": 3,
    "./js/controllers/invite.js": 4,
    "./js/controllers/join.js": 5,
    "./js/controllers/lab-admin.js": 6,
    "./js/controllers/lab.js": 7,
    "./js/controllers/login.js": 8,
    "./js/controllers/user.js": 9,
    "./js/controllers/welcome.js": 10,
    "./js/directives/category-score.js": 11,
    "./js/directives/user-lab.js": 12,
    "./js/filters/objectfilter.js": 13,
    "./js/services/authentication.js": 14,
    "./js/services/authorization.js": 15,
    "./js/services/invites.js": 16,
    "./js/services/labs.js": 17,
    "./js/services/refs.js": 18,
    "./js/services/toast.js": 19,
    "./js/services/users.js": 20
  }],
  2: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('andelabs.controllers')
        .controller('BottomSheetCtrl', ['$scope', '$mdBottomSheet', 'Refs',
          function($scope, $mdBottomSheet, Refs) {
            $scope.items = [{
              name: 'Logout',
              state: 'logout',
              icon: 'fa-sign-out'
            }, {
              name: 'Migrate',
              action: 'migrate',
              icon: 'fa-paper-plane-o'
            }];

            if (Refs.isAdmin()) {
              var adminMenu = [{
                name: 'Invite',
                state: 'admin/invite',
                icon: 'fa-envelope'
              }, {
                name: 'Labs',
                state: 'admin/labs',
                icon: 'fa-flask'
              }, {
                name: 'Users',
                state: 'admin/users',
                icon: 'fa-users'
              }];
              $scope.items = adminMenu.concat($scope.items);
            }
            $scope.listItemClick = function($index) {
              var clickedItem = $scope.items[$index];
              $mdBottomSheet.hide(clickedItem);
            };
          }
        ]);
    })();

  }, {}],
  3: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('andelabs.controllers')
        .controller('HomeCtrl', ['$scope', 'toast', '$rootScope', '$state', '$mdDialog', '$mdBottomSheet', 'Authentication', 'Labs', 'Refs', 'Users',
          function($scope, toast, $rootScope, $state, $mdDialog, $mdBottomSheet, Authentication, Labs, Refs, Users) {

            $scope.init = function() {
              $scope.labs = Labs.all();
              $scope.categories = Labs.getCategories();
              $scope.data = {};
              if (!$rootScope.currentUser.github) {
                // $scope.welcome();
              }
            };

            $scope.showBottomSheet = function($event) {
              $scope.alert = '';
              $mdBottomSheet.show({
                templateUrl: 'views/bottom-sheet.html',
                controller: 'BottomSheetCtrl',
                targetEvent: $event
              }).then(function(clickedItem) {
                if (clickedItem.state) {
                  $state.go(clickedItem.state);
                } else {
                  if (clickedItem.action && clickedItem.action === 'migrate') {
                    $scope.switchAccount();
                  }
                }
              });
            };

            $scope.shortenString = function(str, len) {
              if (!str) {
                return '&nbsp;';
              }
              str = str.toString().split(/\n|\r/);
              str = str[0];
              len = len || 96;
              if (str && str.length >= len) {
                return str.substr(0, len - 3) + '...';
              }
              return str || '';
            };

            $scope.switchAccount = function(ev) {
              $mdDialog.show({
                controller: ['$scope', '$mdDialog', function($scope, $mdDialog) {
                  $scope.migrate = function() {
                    $rootScope.isMigrating = true;
                    $scope.isLoading = true;
                    Authentication.login(function(authData) {
                      if (authData) {
                        Users.migrateAccount(authData, $rootScope.currentUser.$id, function(err, res) {
                          toast(res);
                          $scope.isLoading = false;
                          if (!err) {
                            $rootScope.isMigrating = false;
                            $mdDialog.hide();
                            Authentication.onAuth(authData, true);
                          }
                        });
                      } else {
                        $scope.isLoading = false;
                        $rootScope.isMigrating = false;
                      }

                    });
                  };
                }],
                clickOutsideToClose: true,
                templateUrl: '/views/migrate-account.html',
              });
            };

            $scope.getTotalProgress = function() {
              var percent = 0;
              var submissions = $rootScope.currentUser.submissions;
              if (submissions && $scope.labs) {
                _.each(submissions, function(value, key) {
                  submissions[key].id = key;
                });
                var completed_labs = _.filter(submissions, function(obj) {
                  return obj.completed_at;
                });
                percent = (Object.keys(completed_labs).length / $scope.labs.length) * 100;
              }
              return percent;
            };

            $scope.copyUID = function(ev) {
              var uid = $rootScope.currentUser.uid;
              $mdDialog.show({
                clickOutsideToClose: true,
                controller: ['$scope', '$mdDialog', function($scope, $mdDialog) {
                  $scope.init = function() {
                    // Zero Clipboard API implementation to copy Andelabs UserID to clipboard
                    var client = new window.ZeroClipboard($('#copy-button'));
                    client.on('ready', function(event) {
                      client.on('copy', function(event) {
                        event.clipboardData.setData('text/plain', uid);
                      });

                      client.on('aftercopy', function(event) {
                        toast('Your Andelabs UserID has been copied to your clipboard');
                        $mdDialog.cancel();
                      });
                    });

                    var currentAuth = Refs.root.getAuth();
                    $scope.showReAuth = currentAuth && !/google|custom/i.test(currentAuth.provider);
                  };

                  $scope.reAuth = function() {
                    Authentication.login();
                    $scope.showReAuth = false;
                  };
                  $scope.uid = uid;
                }],
                templateUrl: '/views/clipboard.html',
              });
            };

            $scope.welcome = function() {
              $mdDialog.show({
                  controller: 'WelcomeCtrl',
                  templateUrl: '/views/welcome.html',
                  clickOutsideToClose: false
                })
                .then(function(answer) {

                }, function(ev) {
                  $scope.copyUID();
                });
            };

            $scope.viewScoreboard = function() {
              _.map($scope.categories, function(c) {
                c.on = false;
                return c;
              });
              $scope.selectedCategory = null;
            };

            $scope.switchOnChange = function($index, status) {
              _.map($scope.categories, function(c) {
                c.on = false;
                return c;
              });
              if (!$scope.$$phase) {
                $scope.$apply(function() {
                  if (status === false) {
                    $scope.categories[$index].on = true;
                  }
                });
              } else {
                $scope.categories[$index].on = true;
              }
              //set category object for the filter
              var categoryClone = {};
              categoryClone.name = $scope.categories[$index].name;
              categoryClone.color = $scope.categories[$index].color;
              $scope.selectedCategory = categoryClone;
            };

            $scope.labStatus = function(lab) {
              var started_labs = $rootScope.currentUser.started_labs || [];
              var completed_labs = $rootScope.currentUser.completed_labs || [];
              //Set status to be 1, meaning the lab is untouched
              var status = 1;

              if (started_labs.indexOf(lab.slug) !== -1) {
                status = 2;
              } else if (completed_labs.indexOf(lab.slug) !== -1) {
                status = 3;
              }
              return status;
            };

            $scope.startLab = function(lab) {
              Labs.start($rootScope.currentUser.uid, lab.$id, function() {
                var startedLabRef = Refs.users.child($rootScope.currentUser.uid).child('started_labs');
                startedLabRef.once('value', function(labsSnap) {
                  if (labsSnap.val()) {
                    var labsNames = labsSnap.val();
                    labsNames.push(lab.slug);
                    startedLabRef.set(labsNames);
                    $rootScope.currentUser.started_labs = labsNames;
                  } else {
                    startedLabRef.set([lab.slug]);
                    $rootScope.currentUser.started_labs = [lab.slug];
                  }
                });

                toast('Launching `' + lab.slug + '`...');
              });
            };
          }
        ]);
    })();

  }, {}],
  4: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('andelabs.controllers')
        .controller('InviteCtrl', ['$scope', 'toast', '$rootScope', '$state', '$stateParams', 'Invites',
          function($scope, toast, $rootScope, $state, $stateParams, Invites) {
            var emailRegExp = /,|\n|\r|;|\s/g;

            $scope.init = function() {
              $scope.data = {};
              $scope.invite = Invites.all();
            };

            $scope.update = function() {

              var emails = $scope.invite.emails;
              if (typeof emails === typeof 'string') {
                emails = emails.trim();
                emails = emails.split(emailRegExp);
              }
              Invites.update(emails, function(err) {
                if (err) {
                  console.log(err);
                } else {
                  toast('Email invite list updated');
                }
              });
            };

            $scope.regenerate = function() {
              Invites.regenerate(function(err, res) {
                if (err) {
                  toast('Error re-generating invite code');
                } else {
                  toast(res);
                }
              });
            };

            $scope.send = function() {
              var inviteEmails = $scope.inviteEmails;
              if (typeof inviteEmails === typeof 'string') {
                inviteEmails = inviteEmails.trim();
                inviteEmails = inviteEmails.split(emailRegExp);
              }

              Invites.send(inviteEmails, $scope.invite.code, function(err, res) {
                if (err) {
                  toast('Err ' + err.toString());
                } else {
                  var emails = $scope.invite.emails || [];
                  var inviteEmails = $scope.inviteEmails;
                  inviteEmails = $scope.inviteEmails.split(emailRegExp);

                  for (var i in inviteEmails) {
                    if (emails.indexOf(inviteEmails[i]) === -1) {
                      emails.push(inviteEmails[i]);
                    }
                  }
                  $scope.invite.emails = emails;
                  $scope.update();
                  delete $scope.inviteEmails;
                  toast(res);
                }
              });
            };

            $scope.init();
          }
        ]);
    })();

  }, {}],
  5: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('andelabs.controllers')
        .controller('JoinCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$mdBottomSheet', 'toast', 'Invites',
          function($scope, $rootScope, $state, $stateParams, $mdBottomSheet, toast, Invites) {

            $scope.init = function() {
              $scope.code = $stateParams.joinId;
              if ($scope.code) {
                toast('Verifying your invitation');
                $scope.join();
              }
            };

            $scope.join = function() {
              Invites.join($scope.code, $rootScope.currentUser.uid, $rootScope.currentUser.email, function(err, res) {
                if (!err) {
                  $state.go('default');
                }
                toast(res);
              });
            };
          }
        ]);
    })();
  }, {}],
  6: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('andelabs.controllers')
        .controller('LabAdminCtrl', ['$scope', 'toast', '$rootScope', '$state', '$stateParams', '$mdDialog', 'Labs',
          function($scope, toast, $rootScope, $state, $stateParams, $mdDialog, Labs) {
            var langSupport = require('../../../config/lang-support');
            var splitVar = langSupport.splitVar;

            $scope.init = function() {
              $scope.data = {};
              $scope.labs = Labs.all();
              $scope.categories = Labs.getCategories();
              $scope.labId = $stateParams.labId;
              $scope.languages = langSupport.languages;
              if ($scope.labId) {
                Labs.find($scope.labId).$loaded().then(function(lab) {
                  $scope.selectedLab = lab;
                  if (lab.test) {
                    fetchLab(lab.slug, lab.test.key, lab.test.bucket);
                    getLabSolution();
                  }
                });
              }
            };

            var fetchLab = function(slug, key, bucket) {
              if (key && bucket) {
                $scope.isLoading = true;
                var asAdmin = true;
                Labs.fetch(slug, key, bucket, asAdmin, $scope.selectedLab.test.language, function(err, res) {
                  $scope.isLoading = false;
                  if (!err) {
                    var labSpecs = res;
                    labSpecs = labSpecs.split(splitVar[$scope.selectedLab.test.language]);
                    $scope.labSource = labSpecs[0];
                    $scope.labSourceExtra = labSpecs[1];
                    $scope.updateEditor();
                  } else {
                    console.log(err);
                  }
                });
              }
            };

            $scope.fixSlug = function() {
              if (!$scope.selectedLab.$id) {
                var lab = $scope.selectedLab;
                var langSuffix = '';
                if (lab && lab.test && lab.test.language) {
                  langSuffix = $scope.languages[lab.test.language];
                }
                $scope.selectedLab.slug = (lab.name + langSuffix + '-lab').replace(/[\\/\\\:*?<>,()\.&\^|%#$\s+]+/g, '-').toLowerCase().trim();
              }
            };

            var uploadSpecs = function(cb) {
              if (!$scope.selectedLab.test) {
                return;
              }
              if (!$scope.selectedLab.test.language) {
                return toast('Pick a language');
              }
              var labSpecs = $scope.editor.getSession().toString() + splitVar[$scope.selectedLab.test.language] + $scope.editorExtra.getSession().toString();
              $scope.isLoading = true;
              Labs.uploadSpecs($scope.selectedLab.slug, $scope.languages[$scope.selectedLab.test.language], labSpecs, function(err, res) {
                if (err) {
                  console.log(err);
                  $scope.isLoading = false;
                } else {
                  $scope.selectedLab.test.location = res.Location;
                  $scope.selectedLab.test.key = res.key;
                  $scope.selectedLab.test.bucket = res.bucket;
                  console.log(res);
                  cb();
                }
              });

            };

            $scope.update = function(cb) {
              if ($scope.data.existingCategory) {
                $scope.selectedLab.category = $scope.data.existingCategory;
              }
              uploadSpecs(function() {
                Labs.update($scope.selectedLab, function(ref) {
                  $scope.isLoading = false;
                  toast('Lab successfully updated');
                  if (cb) {
                    cb();
                  }
                });
              });
            };

            var getLabSolution = function() {
              $scope.isLoading = true;
              Labs.fetchSolution($rootScope.currentUser, $scope.selectedLab, function(err, res, isPassed) {
                $scope.isLoading = !$scope.labSource;
                if (err) {
                  console.log(err);
                  $scope.labSolution = '\n\n';
                } else {
                  $scope.labSolution = res;
                  $scope.isPassed = isPassed;
                }
              });
            };

            $scope.editorLoaded = function(editor) {
              $scope.editor = Labs.configureEditor(editor);
            };

            $scope.extraEditorLoaded = function(editor) {
              $scope.editorExtra = Labs.configureEditor(editor);
            };

            $scope.solutionEditorLoaded = function(editor) {
              $scope.editorSolution = Labs.configureEditor(editor);
            };

            $scope.updateEditor = function() {
              if (!$scope.editor) {
                return;
              }
              $scope.editor.getSession().setMode('ace/mode/' + $scope.selectedLab.test.language);
              $scope.editorExtra.getSession().setMode('ace/mode/' + $scope.selectedLab.test.language);
              $scope.editorSolution.getSession().setMode('ace/mode/' + $scope.selectedLab.test.language);
              $scope.fixSlug();
              toast('You are writing ' + $scope.selectedLab.test.language);
            };

            $scope.getRepos = function() {
              Labs.allRepos(function(res) {
                $scope.repos = res;
              });
            };

            $scope.setRepo = function(self) {
              var repo = self.repoId;
              $scope.selectedLab.slug = $scope.repos[repo].name;
              $scope.selectedLab.url = $scope.repos[repo].html_url;
            };

            $scope.addNew = function() {
              $scope.selectedLab = {};
            };


            $scope.remove = function() {
              var name = $scope.selectedLab.name;
              var dialog = $mdDialog.confirm({
                title: 'Remove ' + name,
                content: 'Are you sure to want to remove this lab from Andelabs?',
                ariaLabel: 'Remove Lab',
                ok: 'Remove',
                cancel: 'Nope'
              });

              $mdDialog.show(dialog)
                .then(function() {
                  Labs.delete($scope.selectedLab.test, function(err, res) {
                    if (!err) {
                      console.log(res);
                      Labs.remove($scope.labId, function(err) {
                        $state.go('admin/labs');
                        toast(name + ' successfully deleted', null, null, function() {
                          delete $scope.selectedLab;
                        });
                      });
                    } else {
                      toast('Unable to delete Lab\n');
                      console.log(err);
                    }
                  });

                });

            };

            $scope.submit = function(isTest) {
              var lab = $scope.selectedLab;
              delete $scope.testResult;
              var cb = function() {
                $scope.isLoading = true;
                var isAdmin = true;
                Labs.submit($rootScope.currentUser.uid, $scope.selectedLab, $scope.isPassed, $scope.editorSolution, isTest, isAdmin, function(err, res) {
                  $scope.isLoading = false;
                  console.log('Error', err);
                  console.log('Result', res);
                  if (!err) {
                    $scope.testResult = res;
                    $scope.isPassed = ($scope.isPassed || $scope.testResult.passed) && !res.isTest;
                    toast('Testing Complete');
                  } else {
                    if (err.result) {
                      Labs.showError(err.result);
                    }
                  }
                });
              };
              if (lab.$save) {
                $scope.update(cb);
                toast('Updating specs to run test');
              } else {
                $scope.create(cb);
                toast('Creating specs to run test');
              }
            };

            $scope.create = function(cb) {
              var index = _.findIndex($scope.labs, function(lab) {
                return lab.slug === $scope.selectedLab.slug;
              });

              if (index !== -1) {
                toast('A lab with this id/slug already exist.');
              } else {
                uploadSpecs(function() {
                  Labs.create($scope.selectedLab, $scope.data, function(err) {
                    $scope.isLoading = false;
                    if (err) {
                      toast(err.toString());
                    } else {
                      toast($scope.selectedLab.name + ' created successfully');
                      if (cb) {
                        cb();
                      }
                    }
                  });
                });
              }
            };
          }
        ]);
    })();

  }, {
    "../../../config/lang-support": 21
  }],
  7: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('andelabs.controllers')
        .controller('LabCtrl', ['$scope', 'toast', '$rootScope', '$state', '$stateParams', 'Labs',
          function($scope, toast, $rootScope, $state, $stateParams, Labs) {

            $scope.init = function() {
              var labId = $stateParams.labId;
              if (labId) {
                Labs.find(labId).$loaded().then(function(lab) {
                  $scope.lab = lab;
                  getTestSpecs(lab);
                  $scope.selectedTab = 0;
                });
              }
            };

            var getTestSpecs = function(lab) {
              $scope.isLoading = true;
              if (lab.test) {
                Labs.fetch(lab.slug, lab.test.key, lab.test.bucket, false, lab.test.language, function(err, res) {
                  if (!err) {
                    $scope.labSource = res;
                    $scope.editor.mode = lab.test.language;
                    $scope.editorTest.mode = lab.test.language;
                    $scope.isLoading = !$scope.labSolution;
                    updateEditor();
                  } else {
                    console.log(err);
                    $scope.isLoading = false;
                  }
                });
              }
            };

            $scope.getLabSolution = function() {
              $scope.isLoading = true;
              Labs.start($rootScope.currentUser, $scope.lab.slug, function(err) {
                if (!err) {

                }
                console.log('started', err);
              });
              Labs.fetchSolution($rootScope.currentUser, $scope.lab, function(err, res, isPassed) {
                $scope.isLoading = !$scope.labSource;
                if (err) {
                  console.log(err);
                  $scope.labSolution = '\n';
                  if (err.message) {
                    toast(err.message);
                  }
                } else {
                  $scope.isPassed = isPassed;
                  $scope.labSolution = res;
                }
              });
            };

            $scope.editorLoad = function(editor) {
              $scope.editor = Labs.configureEditor(editor);
            };

            $scope.editorLoadTest = function(editor) {
              $scope.editorTest = Labs.configureEditor(editor);
            };

            $scope.submit = function(isTest) {
              delete $scope.testResult;
              $scope.isLoading = true;

              var isAdmin = false;
              Labs.submit($rootScope.currentUser.uid, $scope.lab, $scope.isPassed, $scope.editor, isTest, isAdmin, function(err, res) {

                $scope.isLoading = false;
                if (!err) {
                  res = res || {};
                  $scope.testResult = res;
                  $scope.isPassed = ($scope.isPassed || ($scope.testResult.passed && $scope.testResult.isSubmission));
                  $rootScope.currentUser.submission = $rootScope.currentUser.submission || {};
                  if (res.submission) {
                    $rootScope.currentUser.submission[$scope.lab.slug] = res.submission;
                  }
                  console.log('Result', res);
                  toast('Done');
                } else {
                  if (err.result) {
                    Labs.showError(err.result);
                  }
                  console.log('Error', err, res);
                  toast('An Error occured running your script');
                }

              });
            };

            var updateEditor = function() {
              if (!$scope.editor) {
                return;
              }
              $scope.editor.getSession().setMode('ace/mode/' + $scope.lab.test.language);
              $scope.editorTest.getSession().setMode('ace/mode/' + $scope.lab.test.language);
              $scope.editorTest.setReadOnly(true);
              toast('You are writing ' + $scope.lab.test.language);
            };

            $scope.init();

          }
        ]);
    })();

  }, {}],
  8: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('andelabs.controllers')
        .controller('LoginCtrl', ['$rootScope', '$scope', '$state', 'Authentication', 'toast',
          function($rootScope, $scope, $state, Authentication, toast) {
            $scope.login = function() {
              Authentication.login(function(user) {

              });
            };

            setTimeout(function() {
              if ($rootScope.currentUser) {
                $state.go('default');
              }
            }, 2000);

          }
        ]);
    })();
  }, {}],
  9: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('andelabs.controllers')
        .controller('UserCtrl', ['$scope', 'Labs', 'toast', '$rootScope', '$state', '$stateParams', 'Users', '$mdDialog',
          function($scope, Labs, toast, $rootScope, $state, $stateParams, Users, $mdDialog) {

            var selectedUser;
            $scope.init = function() {
              $scope.categories = Labs.getCategories();
              Labs.all(function(val) {
                $scope.labs = val;
              });
              $scope.users = Users.all();
              var userId = $stateParams.userId;
              if (userId) {
                $scope.selectedUser = Users.find(userId);
                selectedUser = $scope.selectedUser;
              }
            };

            $scope.viewSolution = function(user, lab) {
              $mdDialog.show({
                controller: ['$scope', '$mdDialog', function($scope, $mdDialog) {
                  $scope.labName = lab.name;
                  $scope.labId = lab.slug;
                  $scope.editorLoad = function(editor) {
                    $scope.editor = Labs.configureEditor(editor);
                  };

                  var init = function() {
                    $scope.isLoading = true;
                    Labs.fetchSolution(user, lab, function(err, res, isPassed) {
                      $scope.isLoading = false;
                      if (err) {
                        console.log(err);
                        $scope.labSolution = '\n';
                        if (err.message) {
                          toast(err.message);
                        }
                      } else {
                        $scope.labSolution = res;
                        if (!$scope.editor) {
                          return;
                        }
                        $scope.editor.getSession().setMode('ace/mode/' + lab.test.language);
                        $scope.editor.setReadOnly(true);
                        toast('You are reading ' + lab.test.language);
                      }
                    });
                  };

                  init();
                }],
                clickOutsideToClose: true,
                templateUrl: '/views/admin/view-solution.html'
              });
            };

            // Restore a disabled User Account
            $scope.restore = function(e) {
              var dialog = $mdDialog.confirm({
                title: 'Restore user account',
                content: 'Are you sure to want to restore ' + $scope.selectedUser.name + '\'s account?',
                ariaLabel: 'Restore Account',
                ok: 'Yes',
                cancel: 'Cancel',
                clickOutsideToClose: true,
                targetEvent: e
              });

              $mdDialog.show(dialog)
                .then(function() {
                  delete $scope.selectedUser.deleted;
                  $scope.selectedUser.$save().then(function() {
                    toast('User Account Restored');
                  });
                });
            };

            // Delete a User Account
            $scope.delete = function(ev) {
              $mdDialog.show({
                controller: ['$scope', '$mdDialog', function($scope, $mdDialog) {

                  var disableUser = function() {
                    selectedUser.deleted = true;
                    selectedUser.$save().then(
                      function(ref) {
                        toast('User successfully disabled');
                        $mdDialog.hide();
                      },
                      function(error) {
                        toast('Unable to disabled user');
                      });
                  };

                  $scope.deleteUser = function() {
                    if ($scope.fullname === selectedUser.name) {
                      // check if user has a github account
                      // If he does, remove from labs team on github.
                      if (selectedUser.github) {
                        Users.removeGitHubUser(selectedUser.github.id, function(err, res) {
                          if (!err) {
                            delete selectedUser.github;
                          } else {
                            toast(err);
                          }
                          disableUser();
                        });
                      } else {
                        // Else, if user doesnt have a github account, disable user anyway.
                        disableUser();
                      }
                    } else {
                      toast('The entered full name does not match');
                    }
                  };
                }],
                clickOutsideToClose: true,
                templateUrl: '/views/admin/delete-user.html'
              });
            };

            $scope.update = function(cb) {
              Users.update($scope.selectedUser, function() {
                toast('User updated successfully');
                if (_.isFunction(cb)) {
                  cb();
                }
              });
            };

            $scope.replayProgress = function() {
              var categoryCounts = {};
              var completedLabs = [];
              var measurements = [];

              //set all intial category counts to 0
              _.each($scope.categories, function(category) {
                categoryCounts[category.id] = {
                  'count': 0
                };
              });

              //populate all the fields in the completed labs
              _.each($scope.selectedUser.completed_labs, function(c_lab) {
                var result = _.find($scope.labs, function(lab) {
                  return lab.slug === c_lab;
                });
                completedLabs.push(result);
              });

              //count the number of completed labs per category
              _.each(completedLabs, function(completedLab) {
                categoryCounts[completedLab.category.id].count = categoryCounts[completedLab.category.id].count + 1;
              });

              //create skilltree measurement objects
              _.each(categoryCounts, function(value, key) {
                measurements.push({
                  organization_id: 'andela',
                  metric_id: key,
                  created_at: Firebase.ServerValue.TIMESTAMP,
                  user_id: $scope.selectedUser.uid,
                  value: value.count,
                });
              });

              //call backend to handle skilltree integration
              Users.updateMeasures($scope.selectedUser.uid, measurements, function(err, res) {
                if (err) {
                  toast(err);
                } else {
                  toast('Measurements Successfully replayed.');
                }
              });
            };

            $scope.removeLab = function(labId, lab) {
              var dialog = $mdDialog.confirm({
                title: 'Remove Lab from user\'s session',
                content: 'Are you sure to want to remove this lab from ' + $scope.selectedUser.name + '\'s session?',
                ariaLabel: 'Remove Lab',
                ok: 'Remove',
                cancel: 'Nope'
              });

              $mdDialog.show(dialog)
                .then(function() {

                  $scope.update(function() {
                    Labs.delete(lab, function(err, res) {
                      if (!err) {
                        console.log(res);
                        Users.removeLab($scope.selectedUser.uid, labId, function() {
                          toast(labId + ' has been deprecated from user document');
                        });
                      } else {
                        toast('Unable to delete Lab\n');
                        console.log(err);
                      }
                    });
                  });
                });
            };

            $scope.init();
          }
        ]);
    })();

  }, {}],
  10: [function(require, module, exports) {
    (function() {
      'use strict';
      angular.module('andelabs.controllers')
        .controller('WelcomeCtrl', ['$rootScope', '$scope', 'Authentication', '$mdDialog', 'toast',
          function($rootScope, $scope, Authentication, $mdDialog, toast) {
            $scope.setUpGithub = function() {
              $scope.inProgress = true;
              Authentication.authWithGithub($rootScope.currentUser, function(err, user) {
                if (err) {
                  $scope.errorMessage = err;
                } else {
                  $rootScope.currentUser = user;
                  toast('Github Account added, reverting back to google OAuth');
                  $mdDialog.cancel();
                  Authentication.login();
                }
              });
            };
          }
        ]);
    })();

  }, {}],
  11: [function(require, module, exports) {
    angular.module("andelabs.directives")
      .directive('categoryScore', function() {
        return {
          restrict: 'E',
          templateUrl: 'views/category-score.html',
          controller: ['$rootScope', '$scope', 'Labs', 'Refs', function($rootScope, $scope, Labs, Refs) {

            $scope.labs = Labs.all();

            $scope.countScore = function(category) {
              var score = 0;
              if ($scope.labs && $rootScope.currentUser.submissions) {
                _.each($rootScope.currentUser.submissions, function(lab, id) {
                  if (lab.completed_at) {
                    _.each($scope.labs, function(lab) {
                      if (id === lab.slug && category.id === lab.category.id) {
                        score++;
                      }
                    });
                  }
                });
                return score;
              }
            };

            $scope.labsInCategory = function(category) {
              var total = 0;
              if ($scope.labs) {
                _.each($scope.labs, function(lab) {
                  if (lab.category.id === category.id) {
                    total++;
                  }
                });
                return total;
              }
            };

          }],
          link: function(scope, element, attrs) {
            element.click(function() {
              scope.$parent.$parent.$parent.$apply(function() {
                scope.$parent.$parent.$parent.switchOnChange(scope.$index, false);
              });
            });
          }
        };
      });

  }, {}],
  12: [function(require, module, exports) {
    angular.module("andelabs.directives")
      .directive('userLab', function() {
        return {
          restrict: 'E',
          templateUrl: 'views/user-lab.html'
        };
      });
  }, {}],
  13: [function(require, module, exports) {
    angular.module('andelabs.filters')
      .filter('orderObjectBy', [function() {
        return function(items, field, reverse) {
          var filtered = [];
          angular.forEach(items, function(item) {
            filtered.push(item);
          });
          filtered.sort(function(a, b) {
            return (a[field] > b[field] ? 1 : -1);
          });
          if (reverse) {
            filtered.reverse();
          }
          return filtered;
        };
      }]);

  }, {}],
  14: [function(require, module, exports) {
    angular.module('andelabs.services')
      .factory('Authentication', ['$http', '$firebase', '$rootScope', '$state', 'Refs', 'toast', 'Invites', 'Users', '$location',
        function($http, $firebase, $rootScope, $state, Refs, toast, Invites, Users, $location) {
          window.state = $state;

          var service = {
            login: function(cb) {
              var self = this;
              var options = {
                remember: true,
                scope: 'email'
              };

              Refs.root.authWithOAuthPopup('google', function(error, authData) {
                if (authData) {
                  if (_.isFunction(cb)) {
                    cb(authData);
                  }
                } else {
                  if (_.isFunction(cb)) {
                    cb(null);
                  }
                  console.log('error', error);
                }
              }, options);
            },

            loginAsAdmin: function(user, cb) {
              $.getJSON('/admin?uid=' + user.uid + '&token=' + user.access_token)
                .success(function(data) {
                  Refs.root.authWithCustomToken(data, cb);
                })
                .fail(function(err) {

                });
            },

            updateUserGithub: function(user, cb) {
              var userRef = Refs.users.child(user.uid);
              userRef.child('github').set(user.github, function(error) {
                if (error) {
                  cb(error, user);
                } else {
                  cb(null, user);
                }
              });
            },

            logout: function() {
              delete $rootScope.currentUser;
              console.log('LOGOUT');
              Refs.root.unauth();
            },

            authWithGithub: function(user, cb) {
              var self = this;
              Refs.root.authWithOAuthPopup('github', function(error, authData) {
                if (error) {
                  console.log('Login Failed!', error);
                } else {
                  user.github = authData.github;
                  //here make call to server to give user perms on labs group
                  $http.get('/github?username=' + user.github.username).
                  success(function(data, status, headers, config) {
                    self.updateUserGithub(user, cb);
                  }).
                  error(function(data, status, headers, config) {
                    console.log('Adding User to GH org failed');
                  });
                }
              });
            },

            auth: function(authData, cb) {
              if (!authData) {
                // we're logged out. nothing else to do
                return cb(null);
              }
              var self = this;
              var userRef = Refs.users.child(authData.uid);
              userRef.once('value', function(snap) {
                var user = snap.val();
                if (authData.provider === 'google') {
                  // are we dealing with a new user? find out by checking for a user record
                  if (user) {
                    if (user.deleted) {
                      cb('Your account has been disabled, you cannot access Andelabs.', user);
                    } else {
                      // google user logging in, update their access token
                      user.access_token = authData.token;
                      userRef.update({
                        access_token: authData.token,
                        picture: authData.google.cachedUserProfile.picture
                      });

                      if (_.isFunction(cb)) {
                        cb(null, user);
                      }
                    }
                  } else {
                    // construct the user record the way we want it
                    user = self.buildUserObjectFromGoogle(authData);
                    Invites.join(200, user.uid, user.email, function(err, res) {
                      cb(err, user);
                      if (!err) {
                        //save to firebase collection of users
                        userRef.set(user, function(error) {

                        });
                      }
                    });
                  }
                } else {
                  if (authData.provider === 'custom' && !$rootScope.currentUser) {
                    user = {
                      uid: authData.uid,
                      github: {

                      }
                    };
                    self.setUser(user);
                  }
                }
              });
            },

            onAuth: function(authData, hideToast) {
              if ($rootScope.isMigrating) {
                return;
              }
              if (authData && authData.uid) {
                service.auth(authData, function(err, user) {
                  if (user) {
                    if (err) {
                      toast(err);
                      service.logout();
                    } else {
                      service.setUser(user);
                      service.loginAsAdmin(user, function(res) {
                        toast('You are logged in as an Administrator');
                      });
                      if (!hideToast) {
                        toast('Welcome, ' + user.name);
                      }
                      $state.go('default');
                    }
                  }
                });
              } else {
                $location.path('/');
              }
            },

            setUser: function(user) {
              // set current user to angular fire version for live updates
              Users.find(user.uid).$loaded(function(val) {
                if (!$rootScope.$$phase) {
                  $rootScope.$apply(function() {
                    $rootScope.currentUser = val;
                  });
                } else {
                  $rootScope.currentUser = val;
                }
              });
            },

            buildUserObjectFromGoogle: function(authData) {
              return {
                uid: authData.uid,
                name: authData.google.displayName,
                email: authData.google.email,
                access_token: authData.google.accessToken,
                first_name: authData.google.cachedUserProfile.given_name,
                known_as: authData.google.cachedUserProfile.given_name,
                last_name: authData.google.cachedUserProfile.family_name,
                picture: authData.google.cachedUserProfile.picture,
                created_at: Firebase.ServerValue.TIMESTAMP
              };
            }
          };
          return service;
        }
      ]);

  }, {}],
  15: [function(require, module, exports) {
    angular.module('andelabs.services')
      .factory('Authorization', ['Refs', 'toast', '$rootScope', function(Refs, toast, $rootScope) {
        // Implement Access control when the state change is about to begin
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

          var adminOnly = /^admin/.test(toState.name);

          // return auth && auth.isAdmin;
          if (adminOnly && !Refs.isAdmin()) {
            // Prevent State Navigation
            toast('Only Administrators can access that page');
            event.preventDefault();
          }

        });
        return {};
      }]);

  }, {}],
  16: [function(require, module, exports) {
    angular.module('andelabs.services')
      .factory('Invites', ['$firebase', 'Refs', '$http',
        function($firebase, Refs, $http) {
          var ref = Refs.invites;
          var membersRef = Refs.members;
          return {
            all: function(cb) {
              if (!cb) {
                return $firebase(ref).$asObject();
              } else {
                ref.once('value', function(snap) {
                  cb(snap.val());
                });
              }
            },

            find: function(uid, cb) {
              membersRef.child(uid).once('value', function(snap) {
                if (snap.val()) {
                  cb(null, snap.val());
                } else {
                  cb('Not verfied', null);
                }
              });
            },

            join: function(code, uid, email, cb) {
              $http.post('/join', {
                uid: uid,
                code: code,
                email: email
              }).success(function(res) {
                cb(null, res);
              }).error(function(err) {
                cb(err, err);
              });
            },

            update: function(emails, cb) {
              return ref.child('emails').set(emails, cb);
            },

            regenerate: function(cb) {
              $http.get('/invite/generate-code').success(function(res) {
                  cb(null, res);
                })
                .error(function(err) {
                  cb(err, null);
                });
            },

            send: function(emails, code, cb) {
              $http.post('/invite/send', {
                emails: emails,
                code: code
              }).success(function(res) {
                cb(null, res);
              }).error(function(err) {
                cb(err, null);
              });
            }
          };
        }
      ]);

  }, {}],
  17: [function(require, module, exports) {
    angular.module('andelabs.services')
      .factory('Labs', ['$firebase', 'Refs', '$http', '$mdDialog',
        function($firebase, Refs, $http, $mdDialog) {
          var ref = Refs.labs;
          return {
            all: function(cb) {

              if (!cb) {
                return $firebase(ref).$asArray();
              } else {
                ref.once('value', function(snap) {
                  cb(snap.val());
                });
              }
            },

            showError: function(message) {
              $mdDialog.show({
                  controller: function() {},
                  template: '<md-dialog class="stick-container"><md-dialog-content class="md-sticky-no-effect">Test Solution Errors<md-subheader></md-subheader><pre>' + message + '</pre></md-dialog-content></md-dialog>',
                  clickOutsideToClose: true
                })
                .then(function(answer) {
                  $mdDialog.hide();
                }, function() {

                });
            },

            configureEditor: function(editor) {
              var session = editor.getSession();
              editor.setTheme('ace/theme/monokai');
              editor.$blockScrolling = Infinity;
              editor.setPrintMarginColumn(120);
              session.setUseWrapMode(true);
              session.setTabSize(2);
              session.setMode('ace/mode/javascript');
              return editor;
            },

            submit: function(uid, lab, isPassed, editor, isTest, isAdmin, cb) {
              var data = {
                isTest: isTest,
                isAdmin: isAdmin,
                userId: uid,
                language: lab.test.language,
                solutionText: editor.getSession().toString(),
                labId: lab.slug,
                passed: isPassed,
                categoryId: lab.category.id,
                labKey: lab.test.key,
                exports: lab.test.exports,
                labBucket: lab.test.bucket
              };
              $http.post("/api/submission", data)
                .success(function(res) {
                  cb(null, res);
                })
                .error(function(err) {
                  cb(err, err);
                });
            },

            uploadSpecs: function(labSlug, labExtenstion, labSpecs, cb) {
              $http.post('/api/lab/upload', {
                  labExtenstion: labExtenstion,
                  labSlug: labSlug,
                  content: labSpecs,
                  directory: 'labs'
                }).success(function(res) {
                  cb(null, res);
                })
                .error(function(err) {
                  cb(err, err);
                });
            },

            fetch: function(labSlug, key, bucket, asAdmin, language, cb) {
              $http.post('/api/lab/fetch/' + labSlug, {
                key: key,
                bucket: bucket,
                language: language,
                asAdmin: asAdmin
              }).success(function(result) {
                cb(null, result);
              }).error(function(err) {
                cb(err, err);
              });
            },

            fetchSolution: function(user, lab, cb) {
              if (user.submissions && user.submissions[lab.slug]) {
                var submission = user.submissions[lab.slug];
                var key = submission.key;
                var bucket = submission.bucket;
                var labSubmissions = lab.submissions;
                var isPassed = false;
                if (labSubmissions) {
                  var labSubmission = labSubmissions[user.uid] || {};
                  isPassed = labSubmission.passed || false;
                }
                $http.post('/api/lab/solution/fetch/', {
                  key: key,
                  bucket: bucket,
                }).success(function(result) {
                  cb(null, result, isPassed);
                }).error(function(err) {
                  cb(err, err, isPassed);
                });
              } else {
                cb(404, 'No solution file yet');
              }
            },

            start: function(user, labId, cb) {
              if (user.submissions && user.submissions[labId]) {
                cb(null);
              } else {
                Refs.users.child(user.uid).child('submissions').child(labId).child('created_at').set(Firebase.ServerValue.TIMESTAMP, cb);
              }
            },

            allRepos: function(cb) {
              return $http.get('/github/repos').success(cb);
            },

            getCategories: function() {
              return $firebase(Refs.categories).$asArray();
            },

            find: function(labId, cb) {
              if (!cb) {
                return $firebase(ref.child(labId)).$asObject();
              } else {
                ref.child(labId).once('value', function(snap) {
                  var lab = snap.val();
                  lab.category = JSON.stringify(lab.category);
                  cb(lab);
                });
              }
            },

            create: function(lab, data, cb) {
              if (data.existingCategory) {
                lab.category = data.existingCategory;
                lab.category = typeof lab.category === typeof "" ? JSON.parse(lab.category) : lab.category;
                delete lab.category.$id;
                delete lab.category.$priority;
                ref.child(lab.slug).set(lab, cb);
              } else {
                lab.category = typeof lab.category === typeof "" ? JSON.parse(lab.category) : lab.category;
                delete lab.category.$id;
                delete lab.category.$priority;
                Refs.categories.child(lab.category.id).set(lab.category, function(error) {
                  if (!error) {
                    ref.child(lab.slug).set(lab, cb);
                  }
                });
              }
              console.log(lab);
            },

            delete: function(obj, cb) {
              if (obj.key && obj.bucket) {
                $http.post('/api/lab/delete', {
                    key: obj.key,
                    bucket: obj.bucket
                  })
                  .success(function(res) {
                    return cb && cb(null, res);
                  })
                  .error(function(err) {
                    return cb && cb(err, err);
                  });
              } else {
                cb(null, 'Lab solution file not found');
              }

            },

            remove: function(labId, cb) {
              ref.child(labId).remove(cb);
            },

            update: function(lab, cb) {
              lab.category = typeof lab.category === typeof "" ? JSON.parse(lab.category) : lab.category;
              lab.$save().then(cb);
            }
          };
        }
      ]);

  }, {}],
  18: [function(require, module, exports) {
    angular.module('andelabs.services')
      .factory('Refs', ['$firebase', '$cookies',
        function($firebase, $cookies) {
          var rootRef = new Firebase($cookies.rootRef || 'https://andelabs-dev.firebaseio.com/');
          window.rootRef = rootRef;

          // define every standard ref used in the application here
          // so that they are defined just once, not scattered throughout
          return {
            categories: rootRef.child('categories'),
            labs: rootRef.child('labs'),
            root: rootRef,
            members: rootRef.child('members'),
            sessions: rootRef.child('sessions'),
            invites: rootRef.child('invites'),
            users: rootRef.child('users'),
            isAdmin: function() {
              var auth = rootRef.getAuth() ? rootRef.getAuth().auth : false;
              return auth && auth.isAdmin;
            },
          };
        }
      ]);

  }, {}],
  19: [function(require, module, exports) {
    angular.module('andelabs.services')
      .factory('toast', ['$mdToast', function($mdToast) {
        return function(text, hideDelay, position, cb, action) {
          text = text || 'Toast Text Goes Here';
          hideDelay = hideDelay || 2000;
          position = position || 'bottom left';

          var toastConfig = $mdToast.simple();
          toastConfig.content(text);
          toastConfig.hideDelay(hideDelay);
          toastConfig.position(position);

          if (_.isObject(action)) {
            toastConfig.action(action.button);
          }

          var toast = $mdToast.show(toastConfig);

          if (_.isObject(action)) {
            toast.then(action.cb);
          }

          if (_.isFunction(cb)) {
            setTimeout(function() {
              cb();
            }, hideDelay);
          }
        };
      }]);

  }, {}],
  20: [function(require, module, exports) {
    angular.module('andelabs.services')
      .factory('Users', ['$firebase', 'Refs', '$http',
        function($firebase, Refs, $http) {
          return {
            all: function(cb) {
              if (!cb) {
                return $firebase(Refs.users).$asArray();
              } else {
                Refs.users.once('value', function(snap) {
                  cb(snap.val());
                });
              }
            },

            migrateAccount: function(authData, uid, cb) {
              $http.post('/migrate', {
                authData: authData,
                uid: uid
              }).success(function(res) {
                cb(null, res);
              }).error(function(err) {
                cb(err, err);
              });
            },

            find: function(uid, cb) {
              if (!cb) {
                return $firebase(Refs.users.child(uid)).$asObject();
              } else {
                Refs.users.child(uid).once('value', function(snap) {
                  cb(snap.val());
                });
              }
            },

            update: function(user, cb) {
              user.$save().then(cb);
            },

            removeLab: function(uid, labId, cb) {
              Refs.labs.child(labId).child(uid).remove(function(err) {
                if (!err) {
                  return Refs.users.child(uid).child('submissions').child(labId).remove(cb);
                }
                return cb && cb(err);
              });

            },

            updateMeasures: function(uid, measurements, cb) {
              $http.post('/replay', {
                uid: uid,
                measurements: measurements
              }).success(function(res) {
                cb(null, res);
              }).error(function(err) {
                cb(err, err);
              });
            },

            removeGitHubUser: function(uid, cb) {
              $http.delete('/github/remove/' + uid).success(function(res) {
                cb(null, res);
              }).error(function(err) {
                cb(err, err);
              });
            },
          };
        }
      ]);

  }, {}],
  21: [function(require, module, exports) {
    module.exports = {
      splitVar: {
        javascript: '\n/**EXTRA**/\n',
        ruby: '\n####EXTRA\n',
        python: '\n####EXTRA\n'
      },

      languages: {
        clojure: '.clj',
        javascript: '.js',
        php: '.php',
        python: '.py',
        ruby: '.rb'
      }
    };

  }, {}]
}, {}, [1]);
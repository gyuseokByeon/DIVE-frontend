angular = require('angular')
_ = require('underscore')

angular.module('diveApp.visualization', [ 'diveApp.services' ])

angular.module('diveApp.visualization').directive('visualizationSideNav', ->
  {
    restrict: 'E'
    templateUrl: 'modules/visualization/partials/side_nav.html'
    controller: 'VisualizationSideNavCtrl'
  }
)

angular.module('diveApp.visualization').directive('visualizationConditionals', ->
  {
    restrict: 'E'
    templateUrl: 'modules/visualization/partials/conditionals.html'
    controller: 'VisualizationConditionalsCtrl'
  }
)

angular.module('diveApp.visualization').directive('visualizationStats', ->
  {
    restrict: 'E'
    templateUrl: 'modules/visualization/partials/stats.html'
    controller: 'VisualizationStatsCtrl'
  }
)

angular.module('diveApp.visualization').directive('visualizationExport', ->
  {
    restrict: 'E'
    templateUrl: 'modules/visualization/partials/export.html'
    controller: 'VisualizationExportCtrl'
  }
)

angular.module('diveApp.visualization').filter('trust', ($sce) ->
  return (val) ->
    return $sce.trustAsHtml(val)
)

angular.module('diveApp.visualization').filter('constructionToSentence', ->
  (construction) ->
    formatted_terms = _.map(construction, (term, i) ->
      type = term.type
      s = term.string
      if i is 0
        s = s.charAt(0).toUpperCase() + s.slice(1)
      '<span class="' + type + '">' + s + '</span>'
    )
    sentence = formatted_terms.join(' ') + '.'
    sentence
)

require('./visualization.ctrl')
require('./builder.ctrl')

require('./visualization.directive')
require('./histogram.directive')
require('./scatterplot.directive')
require('../base/datatable.directive')

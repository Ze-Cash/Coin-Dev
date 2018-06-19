(function($) {

  $(document).on("click", "#instruction, #dashboard, #validator,#view-section", function() {

    $("button").delay(5000).attr("aria-expanded","false");

    $("button").delay(5000).addClass("collapsed");
    
    $("#bs-example-navbar-collapse-1").delay(5000).attr("aria-expanded","false");

    $("#bs-example-navbar-collapse-1").delay(5000).removeClass("show");    
    
    $("#bs-example-navbar-collapse-1").addClass("collapsing").delay(1000).removeClass("collapsing").delay(1000).removeClass("collapse in").addClass("collapse");
    
  });  

})(jQuery); // End of use strict

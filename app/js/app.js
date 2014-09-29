

(function($) {



  var app = $.sammy(function() {

		$.getJSON( "js/data.json", function( data ) {
			var links = [];
		  $.each( data, function( table, tabledata ) {
		    var hash = "#/"+tabledata.hash;
		    var route = "../views/"+tabledata.route;
		    if(tabledata.type == "person"){
		    	links.push("<li><a href='"+hash+"'>"+table+"</a></li>");
		    } else {
		    	links.push("<li class='nav-title'><a href='"+hash+"'>"+table+"</a></li>");
		    }
		    createRoute(hash,route);
		  });
		  createNavi(links);
		});


	  function createRoute(hash,route){
		  app.get(hash, function() {
	      $('.container').load(route,function(data){ callback(); });
	    });  	
	  }

	  function createNavi(links){
		  $( "<ul/>", { "class": "navi", html: links.join( "" ) }).appendTo( ".main-nav" );
	  }


  });



  $(function() {
    app.run();
  });





  function callback(){
				  // Adjust the title
				  var adjustTitle = function(){
				    $('h1').html($('h1').text().split('-')[1]);
				    return;
				  };

				  adjustTitle();  	



  } // callback end


})(jQuery);




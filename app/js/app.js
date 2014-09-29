

(function($) {

	//-------- App Config
  var app = $.sammy(function() {
  	// Initial Route
    this.get('/', function() {
      $('.container').load('../views/FEINHEIT_60_GRAFIK.htm',function(data){ configureTable(); });
    });

    // Get Data
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

		// Create Routes
	  function createRoute(hash,route){
	  	app.bind('test', function(e, data) {
	  		// TODO
        //alert(data['my_data']);
        //console.log(data['my_data']);
      });
		  app.get(hash, function() {
		  	//this.trigger('test', {my_data: hash});
	      $('.container').load(route,function(data){ configureTable(); });
	    });  	
	  }

	  // Create Navi
	  function createNavi(links){
		  $( "<ul/>", { "class": "navi", html: links.join( "" ) }).appendTo( ".main-nav" );
	  }

  }); // var app end


  //-------- Run App
  $(function() {
    app.run();
  });




	//-------- Table Config
	var secondaryTitles = [
			'freiekapazitaet',
			'gesamtbelastung'
	];

	var primaryTitles = [
			'geplant',
			'support',
			'interneprojekte',
			'forecast',
			'ausgeliehen'
	];
	var darkenedColumns = [
			'Wo',
			'Verant'
	];
	var hiddenColumns = [
			'Start',
			'Ende',
			'Total'
	];
	var collapseGroups = [
			['abwesenheiten','freiekapazitaet'],
			['festetermine','grundlasten'],
			['grundlasten','summeprojekte']
	];
	var tableFields = [
			'table',
			'h1',
			'td'
	];

	var configureTable = function(){
		tableConfigurations.removeAttributes(tableFields);
		tableConfigurations.resetTable();
		tableConfigurations.setNegative();

		tableConfigurations.setRowClasses();
		tableConfigurations.setSpecialClasses(primaryTitles,'primary-color');
		tableConfigurations.setSpecialClasses(secondaryTitles,'secondary-color');
		tableConfigurations.setColumnClasses(darkenedColumns,'darken');
		tableConfigurations.setColumnClasses(hiddenColumns,'hidden-column');
		tableConfigurations.setCollapseGroups(collapseGroups);
		tableConfigurations.addEventlistener();



		// TODO
  	$('.main-nav a').on('click',function(){
  		$('.main-nav a').removeClass('current');
	  	$(this).addClass('current');
	  });


	};


	//-------- Table Configurations
	var tableConfigurations = {

		removeAttributes: function(selectors){			// remove all attributes
		  for(var i = 0; i < selectors.length; i++){
		    $(selectors[i]).each(function(){
		      var $el = $(this);
		      var attributes = $.map(this.attributes,function(attribute){
		        return attribute.name;
		      });
		      $.each(attributes,function(j,attribute){
		        $el.removeAttr(attribute);
		        if(selectors[i] === 'td'){ $el.html($el.text()); }
		      });     
		    });
		  }		
		},

		resetTable: function(){				// reset the table
			$('h1').html($('h1').text().split('-')[1]);
			$('table:eq(1)').unwrap().unwrap().unwrap().unwrap();
		  $('table').first().addClass('main-table');
		  $('title,hr').remove();
		},

		setNegative: function(){			// set negative color
		  $('td').each(function(){
		    if(parseFloat($(this).html()) < 0){
		      $(this).addClass("red");
		    }
		  });			
		},

		setRowClasses: function(){				// set row classes
		  $('.main-table tr').each(function(i){
		  	var substr = '&nbsp;&nbsp;&nbsp';
		    var classname = $(this).children().first().text().toLowerCase();
		    classname = classname.replace(/\s+/g, '')
		                          .replace('ä','ae')
		                          .replace('ö','oe')
		                          .replace('ü','ue')
		                          .replace('/','')
		                          .replace('.','')
		                          .replace('2014','');

		    if($(this).children().first().html().indexOf(substr)){
		    	$(this).addClass(classname);
		    }				                            
		  });				
		},

		setSpecialClasses: function(selectors,classname){			// set special classes
		  for(var i = 0; i < selectors.length; i++){
		    $('.main-table tr').each(function(j){
		      if($(this).hasClass(selectors[i])){
		        $(this).addClass(classname);
		      }
		    });
		  }  		
		},

		setColumnClasses: function(testStringArr,classname){			// set vertical classes
			for(var k = 0; k < testStringArr.length; k++){
		    var rowArr = [];
		    $('tr:first-child td').each(function(i){
		      var $tablecell = $(this);
		      var str = testStringArr[k];
		      if($tablecell.html().indexOf(str) > -1){
		        rowArr.push(i);
		      }
		    });
		    // Add classname
		    for(var j=0; j<rowArr.length; j++){
		      var td = 'td:nth-child('+(rowArr[j]+1)+')';
		      $(td).addClass(classname);
		    }
		  }				
		},

		setCollapseGroups: function(groupArr){			// set accordion groups
			for(var i = 0; i<groupArr.length; i++){
				var start, end, range;
				$('tr').each(function(j){
					if($(this).hasClass(groupArr[i][0])){
						$(this).addClass('collapse-parent collapse-'+i);
						start = j+2;
					}
					if($(this).hasClass(groupArr[i][1])){ end = j+1; }
				});
		    for (var k = start; k < end; k++){
		      var tr = 'tr:nth-child('+k+')';
		      $(tr).addClass('hidden-row hide-'+i);
		    }
			}					
		},

		addEventlistener: function(){
			$('.collapse-0').on('click',function(){
				$(this).toggleClass('visible');
				$('.hide-0').toggleClass('visible');
			});
			$('.collapse-1').on('click',function(){
				$(this).toggleClass('visible');
				$('.hide-1').toggleClass('visible');
			});
			$('.collapse-2').on('click',function(){
				$(this).toggleClass('visible');
				$('.hide-2').toggleClass('visible');
			});
		}

	}; // tableConfigurations end


})(jQuery); // Config end












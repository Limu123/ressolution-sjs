'use strict';


(function($) {

	//-------- App Config
  var app = $.sammy(function() {

    // Get Data
		$.getJSON( 'js/data.json', function( data ) {
			var links = [];
		  $.each( data, function( table, tabledata ) {
		    var hash = '#/'+tabledata.hash,
		    		route = '../views/'+tabledata.route,
		    		classname = tabledata.hash,
		    		position = tabledata.position;
		    if(tabledata.type === 'person'){
		    	links.push('<li class="'+classname+'"><a href="'+hash+'">'+table+'</a></li>');
		    } else {
		    	links.push('<li class="nav-title '+classname+'"><a href="'+hash+'">'+table+'</a></li>');
		    }
		    createRoute(hash,route,classname,table,position);
		  });
		  createNavi(links);
		});

		// Create Routes
	  function createRoute(hash,route,classname,table,position){
		  app.get(hash, function() {
	      $('.container').load(route,function(){
	      	configureTable(table,position);
	      	configureNavi(classname);
	      });
	    });  	
	  }

	  // Create Navi
	  function createNavi(links){
		  $( '<ul/>', { 'class': 'navi', html: links.join( '' ) }).appendTo( '.main-nav' );
	  }

  }); // app config end




  //-------- Run App
  $(function() {
    app.run();
  });




	//-------- Navi Config
	var configureNavi = function(classname){
		naviConfigurations.reset();
		naviConfigurations.setActive(classname);
	};

	var naviConfigurations = {
		reset: function(){
			$('.main-nav li a').removeClass('current');
		},
		setActive: function(classname){
			var el = '.main-nav li.'+classname+' a';
			$(el).addClass('current');
		}
	}; // naviConfigurations end






	//-------- Table Config

	// set grey background if row has class
	var secondaryTitles = [
			'freiekapazitaet',
			'gesamtbelastung'
	];

	// set blue background if row has class
	var primaryTitles = [
			'geplant',
			'support',
			'interneprojekte',
			'forecast',
			'ausgeliehen',
			'grafik', 
			'programmierung', 
			'projektmanagement', 
			'beratung&akquise'
	];

	// darken a column if string in first row contains substring 
	var darkenedColumns = [
			'Wo'
	];

	// hide a column if string in first row contains substring
	var hiddenColumns = [
			'Start',
			'Ende',
			'Total'
	];

	// collapse rows after [0] and before [1]
	var collapseGroups = [
			['abwesenheiten','freiekapazitaet'],
			['festetermine','grundlasten'],
			['grundlasten','summeprojekte']
	];

	// remove all attributes and inline-styling
	var tableFields = [
			'table',
			'h1',
			'td'
	];

	// week columns
	var weekArr = [];

	var configureTable = function(table,position){
		tableConfigurations.removeAttributes(tableFields);
		tableConfigurations.resetTable(table,position);
		tableConfigurations.setNegative();
		tableConfigurations.setRowClasses();
		tableConfigurations.setSpecialClasses(primaryTitles,'primary-color');
		tableConfigurations.setSpecialClasses(secondaryTitles,'secondary-color');
		tableConfigurations.setColumnClasses(darkenedColumns,'darken');
		tableConfigurations.setColumnClasses(hiddenColumns,'hidden-column');
		tableConfigurations.hideWeekends('hidden-column');
		tableConfigurations.setCollapseGroups(collapseGroups);
		tableConfigurations.addEventlisteners();
	};


	//-------- Table Configurations
	var tableConfigurations = {

		removeAttributes: function(selectors){			// remove all attributes
		  for(var i = 0, len=selectors.length; i < len; i++){
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

		resetTable: function(table,position){				// reset the table
			//$('h1').html($('h1').text().split('-')[1]);
			$('h1').text(table).append('&nbsp;<span>'+position+'</span>');
			$('table:eq(1)').unwrap().unwrap().unwrap().unwrap();
		  $('table').first().addClass('main-table');
		  $('title,hr').remove();
		},

		setNegative: function(){			// set negative color
		  $('td').each(function(){
		    if(parseFloat($(this).html()) < 0){
		      $(this).addClass('negative');
		    }
		  });			
		},

		setRowClasses: function(){				// set row classes
		  $('.main-table tr').each(function(){
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
		    $('.main-table tr').each(function(){
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
		    if(testStringArr[k]==='Wo'){
		    	weekArr = rowArr;
		    }	
		    this.setClasses(rowArr,classname);
		  }			
		},

		hideWeekends: function(classname){					// hide the weekends
			var weekendsArr = [];
			for(var i = 0; i < weekArr.length; i++){
				var tempSa = weekArr[i]+6;
				var tempSo = weekArr[i]+7;
				weekendsArr.push(tempSa);
				weekendsArr.push(tempSo);
			}
	    this.setClasses(weekendsArr,classname);
		},

		setClasses: function(arr,classname){		// set classes
	    for(var i=0; i<arr.length; i++){
	      var td = 'td:nth-child('+(arr[i]+1)+')';
	      $(td).addClass(classname);
	    }
		},

		setCollapseGroups: function(groupArr){			// set accordion groups
			for(var i = 0; i<groupArr.length; i++){
				var start, end;
				var tempStart, tempEnd;
				$('tr').each(function(j){		
					if($(this).hasClass(groupArr[i][0])){
						start = j+2;
						tempStart = $(this);
					}
					if($(this).hasClass(groupArr[i][1])){
						end = j+1;
						tempEnd = $(this);
						if(end-start > 0){ tempStart.addClass('collapse-parent collapse-'+i); }						
					}
				});
		    for (var k = start; k < end; k++){
		      var tr = 'tr:nth-child('+k+')';
		      $(tr).addClass('hidden-row hide-'+i);
		    }
			}					
		},

		addEventlisteners: function(){			// event listeners
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





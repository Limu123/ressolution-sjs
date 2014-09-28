

(function($) {
  var app = $.sammy(function() {

    this.get('#/sb', function() {
      $('.container').load('../views/FEINHEIT_70_SB.htm',function(data){ callback(); });
    });

    this.get('#/dbo', function() {
      $('.container').load('../views/FEINHEIT_62_DBO.htm',function(data){ callback(); });
    });

    this.get('#/cg', function() {
      $('.container').load('../views/FEINHEIT_76_CG.htm',function(data){ callback(); });
    });

    this.get('#/sw', function() {
      $('.container').load('../views/FEINHEIT_83_SW.htm',function(data){ callback(); });
    });

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



				  // Reset table
				  var resetTable = function(){
				    $('table:eq(1)').unwrap().unwrap().unwrap().unwrap();
				    $('table').first().addClass('main-table');
				    $('title,hr').remove();
				    return;
				  };


				  // Remove all Attributes
				  var removeAttributes = function(selectors){
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
				    return;
				  };


				  // Set row classes
				  var setRowClasses = function(){
				    $('.main-table tr').each(function(i){
				      var classname = $(this).children().first().text().toLowerCase();
				      classname = classname.replace(/\s+/g, '')
				                            .replace('ä','ae')
				                            .replace('ö','oe')
				                            .replace('ü','ue')
				                            .replace('/','')
				                            .replace('.','')
				                            .replace('2014','');
				      $(this).addClass(classname);
				    });
				    return;
				  };


				  // Set special classes
				  var setSpecialClasses = function(selectors,classname){
				    for(var i = 0; i < selectors.length; i++){
				      $('.main-table tr').each(function(j){
				        if($(this).hasClass(selectors[i])){
				          $(this).addClass(classname);
				        }
				      });
				    }      
				    return;
				  };






				  // get vertical columns
				  var getVerticalColumns = function(testString,classname){
				    var rowArr = [];
				    $('tr:first-child td').each(function(i){
				      var $tablecell = $(this);
				      var str = testString;
				      if($tablecell.html().indexOf(str) > -1){
				        rowArr.push(i);
				      }
				    });
				    // Add classname
				    for(var j=0; j<rowArr.length; j++){
				      var td = 'td:nth-child('+(rowArr[j]+1)+')';
				      $(td).addClass(classname);
				    }
				    return;
				  };



				  // set negative color
				  var setNegative = function(){
				    $('td').each(function(){
				      if(parseFloat($(this).html()) < 0){
				        $(this).addClass("red");
				      }
				    });
				    return;
				  };



				  var getHiddenRows = function(startRow,endRow){
				    var start, end, range;
				    $('tr').each(function(i){
				      if($(this).hasClass(startRow)){ start = i+2; }
				      if($(this).hasClass(endRow)){ end = i+1;}
				    });
				    range = end - start;

				    for (var i = start; i < end; i++){
				      var tr = 'tr:nth-child('+i+')';
				      $(tr).addClass('hidden-row');
				    }
				    return;
				  };







				  adjustTitle();
				  removeAttributes(['table','h1','td']);
				  resetTable();
				  
				  setRowClasses();
				  setSpecialClasses(['abwesenheiten','festetermine','grundlasten'],'collapse-parent');
				  setSpecialClasses(['freiekapazitaet','gesamtbelastung'],'secondary-color');
				  setSpecialClasses(['geplant','support','interneprojekte','forecast','ausgeliehen'],'primary-color');
				  
				  getVerticalColumns('Wo','darken');
				  getVerticalColumns('Start','hidden-column');
				  getVerticalColumns('Ende','hidden-column');
				  getVerticalColumns('Total','hidden-column');

				  setNegative();

				  getHiddenRows('abwesenheiten','freiekapazitaet');
				  getHiddenRows('festetermine','grundlasten');
				  getHiddenRows('grundlasten','geplant');




				  // Collapse rows
				  $('.collapse-parent').on('click',function(){
				    $('.hidden-row').toggleClass('visible');
				  });

  } // callback end


})(jQuery);




$(document).ready(function(){
	updateOnClick();
	$(window).bind('hashchange', function() {
 		updateOnClick();
	});
});

function updateOnClick() {
	var slug = location.hash.substring(1);
	var currentCourse = findInObjectArray(data, 'slug', slug);
	if(!currentCourse) {
		currentCourse = data[0];
	}
	$('#navbar').empty();
	data.forEach(function(course) {
		if(currentCourse.title == course.title){
			var element = '<li class="active">';
		} else {
			var element = '<li>';
		}
		element += '<a href="#'+course.slug+'" onclick="updateOnClick()">'+course.title+'<span class="sr-only">(current)</span></a></li>';
		$('#navbar').append(element);
	});
	$('#content-container').empty();
	currentCourse.slides.forEach(function(slide){
		var element = '<div class="col-xs-6 col-md-3 text-center"><div class="tile-small-upper"><p>'+slide.title+'</p><a target="_blank" href="viewer.html?slug='+currentCourse.slug+'&content='+slide.title + '" role="button"><img src="files/'+currentCourse.slug+'/images/'+slide.slug+'-0.png" class="img-responsive" alt="Responsive image"></a></div><figure class="tile-small-bottom"><a class="btn btn-success" target="_blank" href="'+slide.location+'" role="button">Download</a><a class="btn btn-primary" target="_blank" href="viewer.html?slug='+currentCourse.slug+'&content='+slide.title + '" role="button">Bekijk online</a></figure></div>';
		$('#content-container').append(element);
	});
}

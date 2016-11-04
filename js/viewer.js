var loadCounter = 0;
var externalCalls = 1;
var data;

$(document).ready(function(){
	$.ajax({
		url:'js/data.js',
		success: function(response) {
			data = response;
			countLoadedElements(addSlides);
		},
		dataType: "json",
		mimeType: "application/json"
	});
});

function addSlides() {
	var courseSlug = getUrlParameter('slug');
	var courseSlide = getUrlParameter('content');
	var currentCourse = findInObjectArray(data, 'slug', courseSlug);
	if(currentCourse) {
		var slides = currentCourse.slides;
		var slide = findInObjectArray(slides, 'title', courseSlide);
		if(slide) {
			var anchorsArray = ['intro'];
			var firstSlide = '<div class="section text-center" id="intro"><h1 id="title">'+slide.title+'</h1><p>Door Luc Veldhuis</p></div>';
			$('#fullpage').append(firstSlide);
			for(var i = 0; i <= slide.length; i++){
				var styleSettings = 'background:url(\'files/'+currentCourse.slug+'/images/'+slide.slug+'-'+i+'.png\') no-repeat center; background-size: contain;';
				var element = '<div class="section" id="slide'+i+'" style="'+styleSettings+'"></div>';
				$('#fullpage').append(element);
				anchorsArray.push('slide'+i);
			}
		}
	}
	$('#fullpage').fullpage({
		scrollBar: true,
		navigation: true,
		navigationPosition: 'right',
		//anchors: anchorsArray
	});
}
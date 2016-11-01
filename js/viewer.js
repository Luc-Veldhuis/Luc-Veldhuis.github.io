$(document).ready(function(){
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
				var element = '<div class="section" id="slide'+i+'" style="background:url(\'files/'+currentCourse.slug+'/images/'+slide.slug+'-'+i+'.png\') no-repeat center; background-size: contain;"></div>';
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
});

//magick convert -density 150 -quality 100 slides1.pdf images/slides1.png
var navElement;
var slideElement;
var assignmentElement;
var loadCounter = 0;
var externalCalls = 4;
var data;

$(document).ready(function(){
	$.ajax({
		url:'js/data.js',
		success: function(response) {
			data = response;
			countLoadedElements(updateOnClick);
		},
		dataType: "json",
		mimeType: "application/json"
	});
	$.ajax({
	  url: 'blocks/navElement.html',
	  success: function(data) {
			navElement = $(data);
			countLoadedElements(updateOnClick);
		},
	  dataType: 'html'
	});
	$.ajax({
	  url: 'blocks/slideElement.html',
	  success: function(data) {
			slideElement = $(data);
			countLoadedElements(updateOnClick);
		},
	  dataType: 'html'
	});
	$.ajax({
	  url: 'blocks/assignmentElement.html',
	  success: function(data) {
			assignmentElement = $(data);
			countLoadedElements(updateOnClick);
		},
	  dataType: 'html'
	});
	$(window).bind('hashchange', function() {
 		updateOnClick();
	});
});

function countLoadedElements() {
	loadCounter++;
	if(loadCounter == externalCalls) {
		updateOnClick();
	}
}

function updateOnClick() {
	var slug = location.hash.substring(1);
	var currentCourse = findInObjectArray(data, 'slug', slug);
	if(!currentCourse) {
		currentCourse = data[0];
	}
	$('#navbar').empty();
	data.forEach(function(course) {
		var element = $(navElement[0]).clone();
		if(currentCourse.title == course.title){
			element.attr('class', 'active');
		}
		var link = $(element).children();
		link.attr('href', '#'+course.slug);
		link.html(course.title+link.html());
		$('#navbar').append(element).html();
	});
	$('#content-container').empty();
	$('#assignment-container').empty();
	currentCourse.slides.forEach(function(slide){
		var element = $(slideElement[0]).clone();
		var title = element.find('p').html(slide.title);
		var viewLink = 'viewer.html?slug='+currentCourse.slug+'&content='+slide.title;
		var imageLink = 'files/'+currentCourse.slug+'/images/'+slide.slug+'-0.png'
		element.find('a').attr('href', viewLink);
		element.find('a.btn-success').attr('href', slide.location);
		element.find('img').attr('src', imageLink);
		$('#content-container').append(element);
	});
	currentCourse.assignments.forEach(function(assignment){
		var element = $(assignmentElement[0]).clone();
		var title = element.find('p').html(assignment.title);
		element.find('a').attr('href', assignment.location);
		element.find('a.btn-success').attr('href', assignment.location);
		$('#assignment-container').append(element);
	});
}

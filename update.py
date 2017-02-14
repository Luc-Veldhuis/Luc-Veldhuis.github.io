import os
from subprocess import call
import json
import re

FILENAME = 'js/data.js'
STORAGE_LOCATION = 'files/'


def convert_slides(slide_location, slide_image_path, slide_image_name):
	print("Converting file %s" % (slide_image_path + slide_image_name))
	command = "magick convert -density 150 -quality 100 %s %s" % (slide_location, slide_image_path+ slide_image_name)
	call(command)
	files = os.listdir(slide_image_path)
	return len([file for file in files if file.startswith(slide_image_name[:-4])])

def check_if_added(data):
	folders = os.listdir(STORAGE_LOCATION)
	for folder in folders:
		if folder not in [course["slug"] for course in data]:
			#Found new folder
			new_course = {"slides": [], "slug" : folder}
			print('Found a new course')
			new_course["title"] = input('Enter course name for course '+folder)
			data.append(new_course)
	for course in data:
		#Check for slides
		slides = []
		slide_path = STORAGE_LOCATION+course["slug"] + '/slides/'
		for slide_location in os.listdir(slide_path):
			if slide_location[-4:] == ".pdf" and slide_location[:-4] not in [slide["slug"] for slide in course["slides"]]:
				slide = {"location" : slide_path+slide_location, "slug": slide_location[:-4]} 
				print("Found a new slide %s" % (slide_path + slide_location))
				slide["title"] = re.sub("(\w)([\d]+)", r'\1 \2',slide["slug"]).title()
				image_path = STORAGE_LOCATION+course["slug"] + '/images/'
				if(not os.path.exists(image_path)):
					os.makedirs(image_path)
				slide["length"] = convert_slides(slide_path+slide_location,image_path,slide["slug"]+'.png')
				course["slides"].append(slide)
	return data

def check_if_removed(data):
	folders = os.listdir(STORAGE_LOCATION)
	#Check if course is deleted
	data = [course for course in data if course['slug'] in folders]
	#Check if slide is deleted
	for course in data:
		slides_in_folder = os.listdir(STORAGE_LOCATION+course["slug"]+'/slides/')
		slides = [slide for slide in course["slides"] if slide["slug"]+'.pdf' in slides_in_folder]
		course["slides"] = slides
	return data

def check_if_updated(data):
	for course in data:
		for slide in course["slides"]:
			slide_location = STORAGE_LOCATION+course["slug"]+'/slides/'+slide["slug"]+".pdf"
			slide_image_location = STORAGE_LOCATION+course["slug"]+'/images/'+slide["slug"]+"-0.png"
			if os.path.getmtime(slide_location) > os.path.getmtime(slide_image_location):
				slide_image_path = STORAGE_LOCATION+course["slug"]+'/images/'
				slide_image_name = slide["slug"]+".png"
				number_of_slides = convert_slides(slide_location, slide_image_path, slide_image_name)
				slide["length"] = number_of_slides
	return data

def read_json(filename):
	data = None
	with open(filename, 'r') as f:
		json_string = f.read()
		data = json.loads(json_string)
	return data

def store_json(filename, data):
	content = json.dumps(data, sort_keys=True, indent=4)
	with open(filename, 'w') as f:
		f.write(content)

def main():
	data = read_json(FILENAME)
	data = check_if_removed(data)
	data = check_if_added(data)
	data = check_if_updated(data)
	store_json(FILENAME, data)

main()
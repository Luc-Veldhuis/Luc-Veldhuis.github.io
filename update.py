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

def check_if_added(data, location):
	folders = os.listdir(STORAGE_LOCATION)
	for folder in folders:
		if folder not in [course["slug"] for course in data]:
			#Found new folder
			new_course = {"slides": [], "assignments": [], "slug" : folder}
			print('Found a new course')
			new_course["title"] = input('Enter course name for course '+folder+ ': ')
			data.append(new_course)
	for course in data:
		#Check for files
		files = []
		file_path = STORAGE_LOCATION+course["slug"] + '/'+location+'/'
		if os.path.isdir(file_path):
			for file_location in os.listdir(file_path):
				if file_location[-4:] == ".pdf" and file_location[:-4] not in [item["slug"] for item in course[location]]:
					item = {"location" : file_path+file_location, "slug": file_location[:-4]} 
					print("Found a new %s %s" % (location[:-1],file_path + file_location))
					item["title"] = re.sub("(\w)([\d]+)", r'\1 \2',item["slug"]).title()
					if(location == 'slides'):
						image_path = STORAGE_LOCATION+course["slug"] + '/images/'
						if(not os.path.exists(image_path)):
							os.makedirs(image_path)
						item["length"] = convert_slides(file_path+file_location,image_path,item["slug"]+'.png')
					course[location].append(item)
	return data

def check_if_removed(data, location):
	folders = os.listdir(STORAGE_LOCATION)
	#Check if course is deleted
	data = [course for course in data if course['slug'] in folders]
	#Check if file is deleted
	for course in data:
		files_path = STORAGE_LOCATION+course["slug"]+'/'+location+'/'
		if os.path.isdir(files_path):
			files_in_folder = os.listdir(files_path)
			files = [item for item in course[location] if item["slug"]+'.pdf' in files_in_folder]
			course[location] = files
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

def check_slides(data):
	data = check_if_removed(data, 'slides')
	data = check_if_added(data, 'slides')
	data = check_if_updated(data)
	return data

def check_assignments(data):
	data = check_if_removed(data, 'assignments')
	data = check_if_added(data, 'assignments')
	return data

def main():
	data = read_json(FILENAME)
	data = check_slides(data)
	data = check_assignments(data)
	store_json(FILENAME, data)

main()
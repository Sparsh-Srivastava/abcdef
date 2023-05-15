import flask
from flask import request, jsonify
from helper import *

app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/', methods=['GET'])
def home():
	if 'id' in request.args:
		id = request.args['id']
		print("id", id)
		ctext = clean_text(id)
		print("ctext",ctext)
		category = ml(ctext)
		categoryStr = ""
		for i in category:
			categoryStr += i.lower()
			categoryStr += " "
		print("category",categoryStr)
		return categoryStr
	else:
		return "Error: No id field provided."

@app.route('/add_data', methods=['POST'])
def update():
	import csv
	request_data = request.get_json()
	ad_category = request_data['ad_category']
	ad_advertiser = request_data['ad_advertiser']
	ad_product = request_data['ad_product']
	ad_description = request_data['ad_description']
	print(ad_category, ad_advertiser, ad_product, ad_description)
	if(ad_category and ad_advertiser and ad_product and ad_description):
		with open('ad.csv', mode='a') as ad_file:
			ad_writer = csv.writer(ad_file, delimiter=',')
			ad_writer.writerow([ad_category, ad_advertiser, ad_product, ad_description])
			ad_file.close()
		return "sucess"
	else:
		return "Error: Invalid fields"
  	
app.run()
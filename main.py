import os
from flask import Flask, render_template, flash, request, redirect, url_for
from werkzeug.utils import secure_filename
import pandas as pd

UPLOAD_FOLDER = 'C:/users/LHTech-02/Desktop/Scroller/uploads'
ALLOWED_EXTENSIONS = set(['csv'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET','POST'])
def home():
	return render_template('story.html')
	
from flask import send_from_directory

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
	
@app.route('/data_prep')
def data_prep():
    data = pd.read_csv('uploads/sales_data.csv')
    return render_template('data_prep.html',tables=[data.to_html(classes='csv-data')])
	
@app.route('/data')
def show_data():
	return render_template('data.html')

if __name__ == '__main__':
	app.run()

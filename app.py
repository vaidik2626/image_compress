import imaplib
import os
import subprocess
from pathlib import Path
from PIL import Image
import errno
import time
import json
from flask import Flask, jsonify, request
from flask_cors import CORS 

CONVERT_PNG_TO_JPG = False
QUALITY = 85

app = Flask(__name__)
CORS(app, resources={r"/compress": {"origins": "http://localhost:3000"}})

@app.route('/compress', methods=['POST'])
def compress():
    data = request.get_json()
    location = data.get('location')
    result = {}
    
    if location:
        compress_images(location)
        result['message'] = 'Compression completed successfully.'
    else:
        result['error'] = 'Location parameter missing.'

    return jsonify(result)

def compress_images(location):
    global TOTAL_ORIGINAL
    global TOTAL_COMPRESSED
    global TOTAL_GAIN
    global TOTAL_FILES
    
    TOTAL_ORIGINAL = 0
    TOTAL_COMPRESSED = 0
    TOTAL_GAIN = 0
    TOTAL_FILES = 0
    
    for r, d, f in os.walk(location):
        for item in d:
            compress_images(os.path.join(location, item))

        for image in f:
            path = location
            input_path = os.path.join(path, image)
            out_path = path.replace('input', 'output')
            
            if image.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif', 'webp')):
                if os.path.isfile(input_path):
                    try:
                        opt = Image.open(input_path)
                    except Exception as e:
                        print(f'Skipping file: {input_path}. Error: {str(e)}')
                        continue
                    
                    original_size = os.stat(input_path).st_size / 1024 / 1024
                    TOTAL_ORIGINAL += original_size
                    print("Original size: " + f'{original_size:,.2f}' + ' Megabytes')
                    
                    if not os.path.exists(out_path):
                        os.makedirs(out_path, exist_ok=True)
                    
                    out_file = os.path.join(out_path, image)
                    
                    im = opt
                    
                    
                    im.save(out_file)
                    
                    compressed_size = os.stat(out_file).st_size / 1024 / 1024
                    gain = original_size - compressed_size
                    TOTAL_COMPRESSED += compressed_size
                    TOTAL_GAIN += gain
                    TOTAL_FILES += 1
                    print("Compressed size: " + f'{compressed_size:,.2f}' + " Megabytes")
                    print("Gain : " + f'{gain:,.2f}' + " Megabytes")

            else:
                if not os.path.exists(out_path):
                    os.makedirs(out_path, exist_ok=True)
                
                if os.path.isfile(input_path):
                    input_file = input_path
                    output_file = input_file.replace('input', 'output')        
                    print('File not an image, copying instead: ' + input_path)
                    subprocess.call('cp ' + input_file + ' ' + output_file, shell=True)


if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import subprocess
from PIL import Image
from flask import send_file

app = Flask(__name__)

# Set the upload folder
UPLOAD_FOLDER = 'input'
OUTPUT_FOLDER = 'output'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
if not os.path.exists(OUTPUT_FOLDER):
    os.makedirs(OUTPUT_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER

def compress_image(input_path, output_path):
    """
    Compresses the image located at 'input_path' and saves the compressed image in the 'output_path'.
    """
    try:
        image = Image.open(input_path)
        # Perform compression operations here, e.g., resize, reduce quality, etc.
        compressed_image = image.copy()  # For demonstration, just copying the image without compression
        compressed_image.save(output_path)
        return True
    except Exception as e:
        print(f"Error compressing image: {str(e)}")
        return False


@app.route('/upload', methods=['POST'])
def upload_file():
    # check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        try:    
            subprocess.Popen(['python', 'app.py'])
        except Exception as e:
            return jsonify({'error': str(e)})
        return jsonify({'message': 'File successfully uploaded', 'filename': filename})
        output_file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
        file.save(input_file_path)
    
@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    compressed_image_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
    if os.path.exists(compressed_image_path):
        return send_file(compressed_image_path, as_attachment=True)
    else:
        return jsonify({'error': 'File not found'})
    


if __name__ == '__main__':
    app.run(debug=True)

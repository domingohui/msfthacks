from skimage.measure import compare_ssim
from skimage import io
import numpy as np
import cv2
import sys
import urllib.request

def import_image_convert_grey (path):
    img = None
    if 'http:' in path:
        img = io.imread(path)
    else:
        img = cv2.imread(path)

    # Convert image to grey colour
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return img

img1 = import_image_convert_grey (sys.argv[1])
img2 = import_image_convert_grey (sys.argv[2])

print(compare_ssim(img1, img2))
sys.stdout.flush()

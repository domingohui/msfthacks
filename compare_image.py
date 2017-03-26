from skimage.measure import compare_ssim
import numpy as np
import cv2
import sys

def import_image_convert_grey (path):
    img = cv2.imread(path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return img

img1 = import_image_convert_grey (sys.argv[1])
img2 = import_image_convert_grey (sys.argv[2])

print(compare_ssim(img1, img2))
sys.stdout.flush()

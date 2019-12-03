from google_images_download import google_images_download

response = google_images_download.googleimagesdownload()

import sys
from io import StringIO


class RedirectedStdout:
    def __init__(self):
        self._stdout = None
        self._string_io = None

    def __enter__(self):
        self._stdout = sys.stdout
        sys.stdout = self._string_io = StringIO()
        return self

    def __exit__(self, type, value, traceback):
        sys.stdout = self._stdout

    def __str__(self):
        return self._string_io.getvalue()

def downloadimages(query):
    # keywords is the search query
    # format is the image file format
    # limit is the number of images to be downloaded
    # print urs is to print the image file url
    # size is the image size which can
    # be specified manually ("large, medium, icon")
    # aspect ratio denotes the height width ratio
    # of images to download. ("tall, square, wide, panoramic")
    arguments = {"keywords": query,
                 "format": "jpg",
                 "limit": 4,
                 "print_urls": True,
                 "size": "medium",
                 "aspect_ratio": "panoramic"}
    try:
        with RedirectedStdout() as out:
            path_aggs = response.download(arguments)
            raw_urls = str(out)
            urls = [':'.join(i.split(':')[1:]) for i in raw_urls.split('\n') if i.split(':')[0] == 'Image URL']
            return urls[-1]
        # Handling File NotFound Error
    except:
        arguments = {"keywords": query,
                     "format": "jpg",
                     "limit": 4,
                     "print_urls": True,
                     "size": "medium"}

        # Providing arguments for the searched query
        try:
            # Downloading the photos based
            # on the given arguments
            with RedirectedStdout() as out:
                path_aggs = response.download(arguments)
                raw_urls = str(out)
                urls = [':'.join(i.split(':')[1:]) for i in raw_urls.split('\n') if i.split(':')[0] == 'Image URL']
                return urls[-1]
        except:
            return "URL NOT AVAILABLE."
# OpenCVFlow

OpenCVFlow is a visual programming software to dynamically execute image processing of OpenCV.

![demo](https://github.com/ufield/opencvflow/wiki/media/movies/top.gif)

## Introduction
### Image processing types
OpenCVFlow supports several image processing types listed bellow.
- Grayscale
- Binarization
    - Binary
    - ToZero
    - Otsu
- Filter
    - Average
    - Gaussian
- Gradient
    - Sobel
    - Laplacian
    - Canny

### Functions of GUI
Input an image by double clicking a "Input Image" block.  
![input](https://github.com/ufield/opencvflow/wiki/media/movies/input_image.gif)

Execute image processings and save the results.  
![exec_save](https://github.com/ufield/opencvflow/wiki/media/movies/exec_save.gif)

Change parameters by double clicking to blocks of image processing.  
![parameter_change](https://github.com/ufield/opencvflow/wiki/media/movies/parameter_change.gif)

Remove blocks or links by right click.  
![remove](https://github.com/ufield/opencvflow/wiki/media/movies/remove.gif)

Can make branch.  
![branch](https://github.com/ufield/opencvflow/wiki/media/movies/branch.gif)


## Project setup (espacially on Mac OS)
#### Install OpenCV
```
brew update
brew install opencv@4
brew link --force opencv@4

export OPENCV4NODEJS_DISABLE_AUTOBUILD=1
```
See [this page](https://www.npmjs.com/package/opencv4nodejs) for details.

#### Install and build this project
Needs version 8 series of Node.js due to dependency.

Install:
```
npm install
```

Compiles and hot-reloads for development: 
```
npm run electron:serve
```

Compiles and minifies for production: 
```
npm run electron:build
```

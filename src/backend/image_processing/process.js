import cv from 'opencv4nodejs'

class ProcessBase {
  constructor(ext) {
    this.ext = ext
  }

  imgToBase64(img){
    return cv.imencode(this.ext, img).toString('base64')
  }

}

export class GrayScale extends ProcessBase{
  constructor(ext, detailProcess, detailParameters){
    super(ext)
  }

  do(img){
    let gray = img.bgrToGray()
    let base64 = super.imgToBase64(gray)
    return [gray, base64]
  }

}

export class Binarization extends ProcessBase{
  constructor(ext, detailProcess, detailParameters){
    super(ext)
    let cvProcesses = {
      'Binary': cv.THRESH_BINARY,
      'ToZero': cv.THRESH_TOZERO,
      'Otsu': cv.THRESH_OTSU
    }
    this.cvProcess = cvProcesses[detailProcess]
    this._parseDetailParameters(detailProcess, detailParameters)

  }

  do(img){
    let binary = img.threshold(this.threshold, this.max, this.cvProcess)
    let base64 = super.imgToBase64(binary)
    return [binary, base64]
  }

  _parseDetailParameters(detailProcess, detailParameters) {
    this.max = detailParameters['max']
    this.threshold = detailProcess === 'Otsu' ? 0 : detailParameters['threshold']
  }
}

export class Filter extends ProcessBase{

  constructor(ext, detailProcess, detailParameters){
    super(ext)
    this.detailProcess = detailProcess
    this.detailParameters = detailParameters
  }

  do(img){
    let blur
    if(this.detailProcess === 'Average'){
      blur = this._averageFilter(img)
    }
    // if(this.detailProcess === 'Median'){
    //   blur = this._medianFilter(img)
    // }
    if(this.detailProcess === 'Gaussian'){
      blur = this._gaussianFilter(img)
    }
    let base64 = super.imgToBase64(blur)
    return [blur, base64]
  }

  _averageFilter(img){
    let kernelX = this.detailParameters['kernelX']
    let kernelY = this.detailParameters['kernelY']
    let size = new cv.Size(kernelX, kernelY)
    return img.blur(size)
  }

  // segmentation fault occurs when kernel >= 3, so obsolete
  // _medianFilter(img){
  //   let kernel= this.detailParameters['kernel']
  //   return img.medianBlur(kernel)
  // }

  _gaussianFilter(img){
    let kernelX = this.detailParameters['kernelX']
    let kernelY = this.detailParameters['kernelY']
    let size    = new cv.Size(kernelX, kernelY)
    let sigma   = this.detailParameters['sigma']
    return img.gaussianBlur(size, sigma)
  }

}

/**
 *
 */
export class Gradient extends ProcessBase{

  constructor(ext, detailProcess, detailParameters){
    super(ext)
    this.detailProcess = detailProcess
    this.detailParameters = detailParameters
  }

  do(img){
    let grad
    if(this.detailProcess === 'Sobel'){
      grad = this._sobel(img)
    }
    if(this.detailProcess === 'Laplacian'){
      grad = this._laplacian(img)
    }
    if(this.detailProcess === 'Canny'){
      grad = this._canny(img)
    }
    let base64 = super.imgToBase64(grad)
    return [grad, base64]
  }

  _sobel(img){
    let dx = this.detailParameters['dx']
    let dy = this.detailParameters['dy']
    let kernel = this.detailParameters['kernel']
    return img.sobel(cv.CV_64F, dx, dy, kernel)
  }

  _laplacian(img){
    return img.laplacian(cv.CV_64F)
  }

  _canny(img){
    let threshold1 = this.detailParameters['threshold1']
    let threshold2 = this.detailParameters['threshold2']
    return img.canny(threshold1, threshold2)
  }

}

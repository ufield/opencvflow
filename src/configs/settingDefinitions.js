export default {
  Input: {
    imageFileName: '',
    imageFilePath: '',
    imageData: ''
  },

  GrayScale: {},

  Binarization: {
    Binary : [
      {
        paramName: 'threshold',
        paramDefault: 127,
        paramType: 'Number',
        step: 1
      },
      {
        paramName: 'max',
        paramDefault: 255,
        paramType: 'Number',
        step: 1
      },
    ],
    ToZero: [
      {
        paramName: 'threshold',
        paramDefault: 127,
        paramType: 'Number',
        step: 1
      },
      {
        paramName: 'max',
        paramDefault: 255,
        paramType: 'Number',
        step: 1
      },
    ],
    Otsu: [
      {
        paramName: 'max',
        paramDefault: 255,
        paramType: 'Number',
        step: 1
      },
    ]
  },

  Filter: {
    Average: [
      {
        paramName: 'kernelX',
        paramDefault: 3,
        paramType: 'Number',
        step: 1
      },
      {
        paramName: 'kernelY',
        paramDefault: 3,
        paramType: 'Number',
        step: 1
      }
    ],
    // Median: [
    //   {
    //     paramName: 'kernel',
    //     paramDefault: 3,
    //     paramType: 'Number',
    //     step: 1,
    //     description: '(set odd number)',
    //   }
    // ],
    Gaussian: [
      {
        paramName: 'kernelX',
        paramDefault: 3,
        paramType: 'Number',
        step: 1
      },
      {
        paramName: 'kernelY',
        paramDefault: 3,
        paramType: 'Number',
        step: 1
      },
      {
        paramName: 'sigma',
        paramDefault: 0,
        paramType: 'Number',
        step: 0.001,
        description: '(0 is recommended)'
      }
    ]
  },

  Gradient: {
    Sobel: [
      {
        paramName: 'dx',
        paramDefault: 1,
        paramType: 'Number',
        step: 1
      },
      {
        paramName: 'dy',
        paramDefault: 1,
        paramType: 'Number',
        step: 1
      },
      {
        paramName: 'kernel',
        paramDefault: 3,
        paramType: 'Number',
        step: 1,
        description: '(set odd number, max=31)',
      }
    ],
    Laplacian: [],
    Canny: [
      {
        paramName: 'threshold1',
        paramDefault: 100,
        paramType: 'Number',
        step: 1
      },
      {
        paramName: 'threshold2',
        paramDefault: 200,
        paramType: 'Number',
        step: 1
      }
    ]
  }

}


// TODO: python 側と定義を共通化する

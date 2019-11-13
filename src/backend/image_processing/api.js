import pipelineParser from './pipelineParser'

function execPipeline(img, pp) {
  let result = {'resultList': []}
  let existsError = false
  let eMessage = ''

  let base64

  try {
    pp.parse().forEach(function (p) {
      let ret = p['process'].do(img)
      img     = ret[0]
      base64  = ret[1]

      console.log(img)
      // console.log(base64)
      let thisResult = {'blockId': p['blockId'], 'base64': base64}
      result['resultList'].push(thisResult)
    })

  } catch (e) {
    console.log(e)
    existsError = true
    eMessage = e.toString()
  }

  let resultHeader = {'code': '000'}
  if (existsError) {
    resultHeader['code'] = '002'
    result['errorMessage'] = eMessage
  }

  result['header'] = resultHeader
  return result
}


export default function(pipeline){
  console.log('pipeline', pipeline)

  const pp = new pipelineParser(pipeline)
  // console.log(pp.getImage)

  let img = pp.getImage

  let result
  if(img){
    result = execPipeline(img, pp)
  } else{
    let resultHeader = {'code': '001'}
    result = {'header': resultHeader}
    result['errorMessage'] = pp.imageFilePath + ': No such file.'
  }

  // pipelineParser
  return result
}

import axios from 'axios'
import Cookies from 'universal-cookie'
import { MethodsType, DataObject } from 'components/sharedInterfaces'
import { AnyObject } from 'yup/lib/types'

const API_ENDPOINT = 'piegon_api_url'

export const getBearer = async () => {
  try {
    const cookies = new Cookies()
    const sessionToken = cookies.get('authToken')
    if (sessionToken !== null && sessionToken !== undefined) {
      const bearer = 'Bearer ' + sessionToken
      return bearer
    }
  } catch (error) {
    return undefined
  }
}

export const getBearerToken = async () => {
  const bearer = await getBearer()
  if (bearer) {
    return { Authorization: bearer }
  } else {
    return {}
  }
}

const ErrorLogger = (errResponse: {request: {responseURL: string; status: string; _response: object; _method: string}; config: {method: string; data: object}}) => {
  const endpoint = errResponse.request.responseURL.replace(API_ENDPOINT, '')

  console.log('----------------')

  console.log(`${errResponse.config.method} error - status ${errResponse.request.status} `)
  console.log(`${errResponse.config.method} /${endpoint}`)

  // If data object is attached to request
  if (errResponse.config.data) {
    const response: string = JSON.stringify(errResponse.config.data, null, 2)
    console.log('DATA SENT: \n' + response)
  }

  // Server response
  if (errResponse.request._response) {
    const response: string = JSON.stringify(errResponse.request._response, null, 2)
    console.log(`${errResponse.request._method} returned: \n` + response)
  }

  console.log('----------------')
}

interface HTTPFunctions {
  endpoint: string;
  data?: DataObject;
  contentType?: 'application/json';
}

type HTTPMethods = MethodsType;

export interface HTTPResponse {
  data: DataObject;
  status: number;
}

const axiosMethod = (method: HTTPMethods, parameters: { endpoint: HTTPFunctions['endpoint']; data?: HTTPFunctions['data']; config: object }) => {
  switch (method) {
    case 'POST':
      return axios.post(
        parameters.endpoint,
        parameters.data,
        parameters.config
      )
    case 'GET':
      return axios.get(
        parameters.endpoint,
        parameters.config
      )
    case 'DELETE':
      return axios.delete(
        parameters.endpoint,
        parameters.config
      )
    case 'PATCH':
      return axios.patch(
        parameters.endpoint,
        parameters.data,
        parameters.config
      )
    default:
      return ({ data: {}, status: 503 })
  }
}

const SendHTTPrequest = async (
  method: HTTPMethods,
  endpoint: HTTPFunctions['endpoint'],
  contentType: HTTPFunctions['contentType'] = 'application/json',
  data: HTTPFunctions['data'] = {},
  predefinedUrl?: string,
  predefinedHeaders?: DataObject) => {
  let url
  if (predefinedUrl) {
    url = predefinedUrl
  } else {
    url = API_ENDPOINT + endpoint
  }

  let allHeaders: AnyObject
  if (predefinedHeaders) {
    allHeaders = predefinedHeaders
  } else {
    allHeaders = await getBearerToken()
    allHeaders['Content-Type'] = contentType
  }

  const parameters = {
    endpoint: url,
    data: data,
    config: { headers: allHeaders }
  }

  try {
    const response = await axiosMethod(method, parameters)
    return response
  } catch (error) {
    if (!error.response) {
      error.response = {
        status: 503
      }
    }
    ErrorLogger(error)
    if (error.response.status === 401) {
      // Unauthorized
    }
    if (error.response.status === 405) {
      // Method not allowed
    }
    if (error.response.status === 500) {
      // Internal error
    }
    if (error.response.status === 503) {
      // Service Unavailable
    }
    return error.response
  }
}

export default SendHTTPrequest
